"use client";

import { useRouter } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import AuthGuard from "@/components/AuthGuard";
import {
  createOpportunity,
  type CustomerResult,
  type EmployeeResult,
  fetchPicklists,
  type OpportunityPayload,
  type PicklistData,
  type SearchResult,
  type VillageResult,
  searchCustomers,
  searchEmployees,
  searchVillages,
} from "@/lib/salesforce";

type Step = "customer-check" | "form";

const salutations = ["Mr.", "Ms.", "Mrs.", "Dr.", "Prof."];

function SearchableSelect<T extends SearchResult>({
  label,
  placeholder,
  onSearch,
  onSelect,
  selected,
  renderSelected,
  renderDropdownItem,
}: {
  label: string;
  placeholder: string;
  onSearch: (q: string) => Promise<T[]>;
  onSelect: (item: T | null) => void;
  selected: T | null;
  renderSelected?: (item: T) => string;
  renderDropdownItem?: (item: T) => React.ReactNode;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<T[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  const doSearch = useCallback(
    (q: string) => {
      if (q.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      onSearch(q)
        .then((r) => {
          setResults(r);
          setOpen(true);
        })
        .catch(() => setResults([]))
        .finally(() => setLoading(false));
    },
    [onSearch]
  );

  function handleChange(value: string) {
    setQuery(value);
    if (selected) onSelect(null);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 300);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col gap-1.5" ref={containerRef}>
      <label className="text-sm font-medium text-brand-black">{label}</label>
      <div className="relative">
        {selected ? (
          <div className="flex items-center justify-between rounded-xl border border-brand-orange bg-brand-orange/5 px-4 py-3">
            <span className="text-sm text-brand-black font-medium">
              {renderSelected ? renderSelected(selected) : selected.name}
            </span>
            <button
              type="button"
              onClick={() => {
                onSelect(null);
                setQuery("");
                setResults([]);
              }}
              className="ml-2 flex-shrink-0 text-brand-black/40 hover:text-red-500 transition-colors text-lg leading-none"
            >
              &times;
            </button>
          </div>
        ) : (
          <input
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => results.length > 0 && setOpen(true)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-brand-black/20 px-4 py-3 text-sm text-brand-black placeholder:text-brand-black/30 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition"
          />
        )}
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
          </div>
        )}
        {open && results.length > 0 && !selected && (
          <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl border border-brand-black/10 bg-white shadow-lg">
            {results.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelect(item);
                    setQuery(renderSelected ? renderSelected(item) : item.name);
                    setOpen(false);
                  }}
                  className="w-full px-4 py-2.5 text-left hover:bg-brand-orange/5 transition-colors"
                >
                  {renderDropdownItem ? (
                    renderDropdownItem(item)
                  ) : (
                    <span className="text-sm text-brand-black">{item.name}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function RegisterOpportunityPage() {
  return (
    <Suspense fallback={null}>
      <RegisterOpportunityContent />
    </Suspense>
  );
}

function RegisterOpportunityContent() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("customer-check");
  const [hasExisting, setHasExisting] = useState<boolean | null>(null);
  const [existingCustomer, setExistingCustomer] = useState<CustomerResult | null>(null);

  const [picklists, setPicklists] = useState<PicklistData | null>(null);
  const [village, setVillage] = useState<VillageResult | null>(null);
  const [employee, setEmployee] = useState<EmployeeResult | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPicklists()
      .then(setPicklists)
      .catch(() => setError("Failed to load form options. Please try again."));
  }, []);

  function handleCustomerCheck(value: boolean) {
    setHasExisting(value);
    if (!value) {
      setExistingCustomer(null);
      setStep("form");
    }
  }

  function handleExistingCustomerSelect(customer: CustomerResult) {
    setExistingCustomer(customer);
    setStep("form");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const fd = new FormData(e.currentTarget);

    const payload: OpportunityPayload = {
      firstName: (fd.get("firstName") as string) || existingCustomer?.firstName || "",
      lastName: (fd.get("lastName") as string) || existingCustomer?.lastName || "",
      phone: (fd.get("phone") as string) || existingCustomer?.phone || undefined,
      customerSignedDate: fd.get("customerSignedDate") as string,
      existingContactId: existingCustomer?.contactId || undefined,
      accountId: existingCustomer?.id || undefined,
      salutation: (fd.get("salutation") as string) || undefined,
      country: (fd.get("country") as string) || undefined,
      villageId: village?.id,
      district: village?.district || existingCustomer?.district || undefined,
      customerCode: existingCustomer?.customerCode || undefined,
      category: (fd.get("category") as string) || undefined,
      house: (fd.get("house") as string) || undefined,
      phase: (fd.get("phase") as string) || undefined,
      totalSquareMeters: fd.get("totalSquareMeters")
        ? Number(fd.get("totalSquareMeters"))
        : undefined,
      productInterest: (fd.get("productInterest") as string) || undefined,
      employeeId: employee?.id,
    };

    try {
      await createOpportunity(payload);
      router.push("/register-opportunity/success");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create opportunity");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthGuard>
      <div className="flex min-h-screen flex-col bg-brand-white">
        <main className="flex flex-1 flex-col items-center px-4 py-10">
          <div className="w-full max-w-lg">
            {step === "customer-check" && (
              <div className="flex flex-col gap-8 animate-fade-in">
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-bold text-brand-black">Customer Relationship</h1>
                  <p className="text-sm text-brand-black/50">
                    Check if this customer already exists in the system.
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  <p className="text-sm font-medium text-brand-black">
                    Does the customer already have company products?
                  </p>
                  <div className="flex gap-3">
                    {[
                      { label: "Yes", value: true },
                      { label: "No", value: false },
                    ].map((opt) => (
                      <button
                        key={opt.label}
                        type="button"
                        onClick={() => handleCustomerCheck(opt.value)}
                        className={`flex flex-1 items-center justify-center rounded-xl border px-4 py-3 text-sm font-semibold transition-all ${
                          hasExisting === opt.value
                            ? "border-brand-orange bg-brand-orange/10 text-brand-orange"
                            : "border-brand-black/15 text-brand-black hover:border-brand-orange hover:bg-brand-orange/5"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {hasExisting === true && (
                  <div className="flex flex-col gap-4 animate-fade-in">
                    <SearchableSelect<CustomerResult>
                      label="Search Existing Customer (Name, Phone)"
                      placeholder="Search customer remotely..."
                      onSearch={searchCustomers}
                      onSelect={(item) => {
                        if (item) handleExistingCustomerSelect(item);
                        else setExistingCustomer(null);
                      }}
                      selected={existingCustomer}
                      renderSelected={(c) => c.name}
                      renderDropdownItem={(c) => (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-sm font-medium text-brand-black">{c.name}</span>
                          <span className="text-xs text-brand-black/50">
                            {[c.phone, c.village, c.district, c.country]
                              .filter(Boolean)
                              .join(" | ")}
                          </span>
                        </div>
                      )}
                    />
                  </div>
                )}
              </div>
            )}

            {step === "form" && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-8 animate-fade-in">
                <div className="flex flex-col gap-1">
                  <h1 className="text-2xl font-bold text-brand-black">Register an Opportunity</h1>
                </div>

                {error && (
                  <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600 font-medium">
                    {error}
                  </p>
                )}

                <div className="flex flex-col gap-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-orange">
                    Customer Personal Details
                  </p>

                  {existingCustomer ? (
                    <div className="rounded-xl border border-brand-orange/30 bg-brand-orange/5 p-4 flex flex-col gap-1">
                      <p className="text-sm font-semibold text-brand-black">
                        {existingCustomer.name}
                      </p>
                      <p className="text-xs text-brand-black/50">
                        {[
                          existingCustomer.phone,
                          existingCustomer.village,
                          existingCustomer.district,
                          existingCustomer.country,
                        ]
                          .filter(Boolean)
                          .join(" | ")}
                      </p>
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-brand-black">Salutation</label>
                        <select
                          name="salutation"
                          className="rounded-xl border border-brand-black/20 bg-white px-4 py-3 text-sm text-brand-black focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition"
                        >
                          <option value="">Select...</option>
                          {salutations.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-brand-black">First Name</label>
                        <input
                          name="firstName"
                          type="text"
                          required
                          placeholder="Enter first name"
                          className="rounded-xl border border-brand-black/20 bg-white px-4 py-3 text-sm text-brand-black placeholder:text-brand-black/30 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-brand-black">Last Name</label>
                        <input
                          name="lastName"
                          type="text"
                          required
                          placeholder="Enter last name"
                          className="rounded-xl border border-brand-black/20 bg-white px-4 py-3 text-sm text-brand-black placeholder:text-brand-black/30 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-brand-black">
                          Customer Phone Number
                        </label>
                        <input
                          name="phone"
                          type="tel"
                          placeholder="e.g. +250 788 000 000"
                          className="rounded-xl border border-brand-black/20 bg-white px-4 py-3 text-sm text-brand-black placeholder:text-brand-black/30 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition"
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="h-px bg-brand-black/10" />

                <div className="flex flex-col gap-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-orange">
                    Location Data
                  </p>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-brand-black">Country</label>
                    <select
                      name="country"
                      required
                      className="rounded-xl border border-brand-black/20 bg-white px-4 py-3 text-sm text-brand-black focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition"
                    >
                      {picklists?.country.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <SearchableSelect<VillageResult>
                    label="Village"
                    placeholder="Search Village..."
                    onSearch={searchVillages}
                    onSelect={setVillage}
                    selected={village}
                    renderSelected={(v) =>
                      `${v.name} - ${v.cell}, ${v.sector}, ${v.district}`
                    }
                    renderDropdownItem={(v) => (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-brand-black">{v.name}</span>
                        <span className="text-xs text-brand-black/50">
                          Cell: {v.cell} | Sector: {v.sector} | District: {v.district} |{" "}
                          {v.country}
                        </span>
                      </div>
                    )}
                  />
                </div>

                <div className="h-px bg-brand-black/10" />

                <div className="flex flex-col gap-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-brand-orange">
                    Opportunity Info
                  </p>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-brand-black">Category</label>
                    <select
                      name="category"
                      required
                      className="rounded-xl border border-brand-black/20 bg-white px-4 py-3 text-sm text-brand-black focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition"
                    >
                      <option value="">Search Category...</option>
                      {picklists?.category.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-brand-black">House</label>
                    <select
                      name="house"
                      className="rounded-xl border border-brand-black/20 bg-white px-4 py-3 text-sm text-brand-black focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition"
                    >
                      <option value="">Select House...</option>
                      {picklists?.house.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-brand-black">Phase</label>
                    <select
                      name="phase"
                      className="rounded-xl border border-brand-black/20 bg-white px-4 py-3 text-sm text-brand-black focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition"
                    >
                      <option value="">Select Phase...</option>
                      {picklists?.phase.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-brand-black">
                      Total Square Meter
                    </label>
                    <input
                      name="totalSquareMeters"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="Enter total square meters"
                      className="rounded-xl border border-brand-black/20 bg-white px-4 py-3 text-sm text-brand-black placeholder:text-brand-black/30 focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-brand-black">
                      Product Interest
                    </label>
                    <select
                      name="productInterest"
                      className="rounded-xl border border-brand-black/20 bg-white px-4 py-3 text-sm text-brand-black focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition"
                    >
                      <option value="">Select a product...</option>
                      {picklists?.productInterest.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <SearchableSelect<EmployeeResult>
                    label="Employee who signed Contract"
                    placeholder="Search employee..."
                    onSearch={searchEmployees}
                    onSelect={setEmployee}
                    selected={employee}
                    renderSelected={(emp) => emp.name}
                    renderDropdownItem={(emp) => (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-brand-black">{emp.name}</span>
                        <span className="text-xs text-brand-black/50">
                          {[emp.phone, emp.advancementLevel, emp.workLocation]
                            .filter(Boolean)
                            .join(" | ")}
                        </span>
                      </div>
                    )}
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-brand-black">
                      Customer Signed Date
                    </label>
                    <input
                      name="customerSignedDate"
                      type="date"
                      required
                      className="rounded-xl border border-brand-black/20 bg-white px-4 py-3 text-sm text-brand-black focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20 transition"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-xl bg-brand-orange py-4 text-base font-semibold text-white shadow-md transition-all hover:bg-brand-orange-dark active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Submitting..." : "Submit Opportunity"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (step === "form" && hasExisting !== null) {
                        setStep("customer-check");
                      } else {
                        router.back();
                      }
                    }}
                    className="w-full rounded-xl border border-brand-black/20 py-3 text-sm font-semibold text-brand-black transition-all hover:border-brand-black/40 active:scale-95"
                  >
                    Back
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
