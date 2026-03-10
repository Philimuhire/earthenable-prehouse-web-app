"use client";

import { useState } from "react";
import Link from "next/link";

type Tab = "features" | "assessment" | "opportunity" | "api";

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: "features", label: "Features", icon: "M13 10V3L4 14h7v7l9-11h-7z" },
  { id: "assessment", label: "Assessment", icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" },
  { id: "opportunity", label: "Opportunity", icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" },
  { id: "api", label: "API", icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
];

function Icon({ path, className }: { path: string; className?: string }) {
  return (
    <svg className={className || "h-4 w-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );
}

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("features");

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <div className="h-1 bg-gradient-to-r from-brand-orange via-brand-orange-dark to-brand-orange" />

      <header className="sticky top-0 z-20 border-b border-brand-black/[0.06] bg-white/90 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-orange to-brand-orange-dark shadow-lg shadow-brand-orange/25">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <div className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-green-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-brand-black tracking-tight">
                <span className="text-brand-orange">App</span>{" "}
                <span className="text-brand-black/70">Documentation</span>
              </h1>
              <p className="text-[11px] text-brand-black/35 font-medium tracking-wide">Pre-House Assessment</p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="group flex items-center gap-2.5 rounded-2xl bg-brand-black px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-black/90 hover:shadow-xl hover:shadow-brand-black/15 active:scale-[0.97]"
          >
            Go to App
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </header>

      <div className="border-b border-brand-black/[0.06] bg-white">
        <div className="mx-auto max-w-6xl px-6 pb-0 pt-8">
          <p className="mb-6 text-sm text-brand-black/40 max-w-xl">
            Everything you need to know about the Pre-House Assessment app — features, workflows, and API reference.
          </p>
          <nav className="flex gap-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-5 py-3 text-sm font-semibold transition-all rounded-t-xl ${
                  activeTab === tab.id
                    ? "text-brand-orange bg-[#FAFAFA]"
                    : "text-brand-black/35 hover:text-brand-black/60 hover:bg-brand-black/[0.02]"
                }`}
              >
                <Icon path={tab.icon} className={`h-4 w-4 ${activeTab === tab.id ? "text-brand-orange" : ""}`} />
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute left-0 right-0 top-0 h-0.5 rounded-full bg-brand-orange" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-6 py-10">
        <div key={activeTab} className="animate-slide-up">
          {activeTab === "features" && <FeaturesSection />}
          {activeTab === "assessment" && <AssessmentSection />}
          {activeTab === "opportunity" && <OpportunitySection />}
          {activeTab === "api" && <ApiSection />}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ subtitle, children }: { subtitle: string; children: React.ReactNode }) {
  return (
    <div className="mb-2">
      <div className="mb-2 flex items-center gap-2">
        <span className="h-px flex-1 max-w-[30px] bg-brand-orange/40" />
        <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-brand-orange">{subtitle}</p>
      </div>
      <h2 className="text-2xl font-bold text-brand-black tracking-tight">{children}</h2>
    </div>
  );
}

function Card({ icon, title, accent, children }: { icon?: string; title: string; accent?: boolean; children: React.ReactNode }) {
  return (
    <div className={`group relative rounded-2xl border p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-black/[0.06] ${
      accent
        ? "border-brand-orange/20 bg-gradient-to-br from-brand-orange/[0.06] via-brand-orange/[0.02] to-white"
        : "border-brand-black/[0.06] bg-white"
    }`}>
      {icon && (
        <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${
          accent
            ? "bg-brand-orange text-white shadow-md shadow-brand-orange/20"
            : "bg-brand-black/[0.04] text-brand-black/40 group-hover:bg-brand-orange group-hover:text-white group-hover:shadow-md group-hover:shadow-brand-orange/20"
        } transition-all duration-300`}>
          <Icon path={icon} className="h-5 w-5" />
        </div>
      )}
      <h3 className="mb-3 text-[15px] font-bold text-brand-black">{title}</h3>
      <div className="text-[13px] text-brand-black/55 leading-relaxed">{children}</div>
    </div>
  );
}

function ListItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-2.5">
      <span className="mt-[7px] h-1 w-1 flex-shrink-0 rounded-full bg-brand-orange/60" />
      {children}
    </li>
  );
}

function Badge({ color, children }: { color: "green" | "yellow" | "red" | "orange" | "gray"; children: React.ReactNode }) {
  const styles = {
    green: "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/60",
    yellow: "bg-amber-50 text-amber-600 ring-1 ring-amber-200/60",
    red: "bg-red-50 text-red-600 ring-1 ring-red-200/60",
    orange: "bg-brand-orange/10 text-brand-orange ring-1 ring-brand-orange/20",
    gray: "bg-brand-black/[0.04] text-brand-black/50 ring-1 ring-brand-black/[0.08]",
  };
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold ${styles[color]}`}>
      {children}
    </span>
  );
}

function StepCard({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <div className="group relative flex gap-5 rounded-2xl border border-brand-black/[0.06] bg-white p-6 transition-all duration-300 hover:shadow-lg hover:shadow-brand-black/[0.04]">
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-orange to-brand-orange-dark text-sm font-bold text-white shadow-sm shadow-brand-orange/25 transition-transform group-hover:scale-110">
          {step}
        </div>
        <div className="h-full w-px bg-gradient-to-b from-brand-orange/20 to-transparent" />
      </div>
      <div className="flex-1 pt-1">
        <h3 className="mb-2.5 text-[15px] font-bold text-brand-black">{title}</h3>
        <div className="text-[13px] text-brand-black/55 leading-relaxed">{children}</div>
      </div>
    </div>
  );
}

function FeaturesSection() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <SectionTitle subtitle="Overview">Features</SectionTitle>
        <p className="mt-3 text-sm text-brand-black/45 max-w-xl leading-relaxed">
          A web application for EarthEnable Customer Sales Officers (CSOs) to assess houses
          before installation and register sales opportunities in Salesforce.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Card icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" title="Authentication">
          <ul className="space-y-2">
            <ListItem>Username/password login</ListItem>
            <ListItem>Google OAuth (restricted to @earthenable.org)</ListItem>
            <ListItem>JWT-based session management</ListItem>
            <ListItem>Protected routes for all app pages</ListItem>
          </ul>
        </Card>

        <Card icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" title="Pre-House Assessment" accent>
          <ul className="space-y-2">
            <ListItem>Guided form with structural and moisture checks</ListItem>
            <ListItem>Automatic categorization: Green, Yellow, or Red</ListItem>
            <ListItem>Clear result summary with next steps</ListItem>
          </ul>
        </Card>

        <Card icon="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" title="Register Opportunity">
          <ul className="space-y-2">
            <ListItem>Search existing customers from Salesforce</ListItem>
            <ListItem>Create new customer (Contact + Account)</ListItem>
            <ListItem>Search villages, employees from Salesforce</ListItem>
            <ListItem>Create Opportunity with all required fields</ListItem>
          </ul>
        </Card>

        <Card icon="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" title="Tech Stack">
          <ul className="space-y-2">
            <ListItem>Next.js 16, React 18, TypeScript</ListItem>
            <ListItem>Tailwind CSS for styling</ListItem>
            <ListItem>FastAPI (Python) backend</ListItem>
            <ListItem>Salesforce REST API via simple-salesforce</ListItem>
            <ListItem>Deployed on Vercel</ListItem>
          </ul>
        </Card>
      </div>
    </div>
  );
}

function AssessmentSection() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <SectionTitle subtitle="Guide">Assessment Flow</SectionTitle>
        <p className="mt-3 text-sm text-brand-black/45 max-w-xl leading-relaxed">
          CSOs complete a guided assessment form to evaluate house conditions before installation.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <StepCard step={1} title="Start Assessment">
          <p>Navigate to the assessment page from the dashboard. The form walks through structural and moisture questions.</p>
        </StepCard>

        <StepCard step={2} title="Answer Questions">
          <p>Answer each question about the house conditions. The form covers structural integrity and moisture levels.</p>
        </StepCard>

        <StepCard step={3} title="View Result">
          <p className="mb-4">The system automatically categorizes the result based on the answers:</p>
          <div className="space-y-2.5">
            <div className="flex items-center gap-3 rounded-xl bg-emerald-50/60 px-4 py-3 ring-1 ring-emerald-100">
              <Badge color="green">Green</Badge>
              <span>All structural and moisture checks pass</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-amber-50/60 px-4 py-3 ring-1 ring-amber-100">
              <Badge color="yellow">Yellow</Badge>
              <span>Structural checks pass but moisture issues detected</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-red-50/60 px-4 py-3 ring-1 ring-red-100">
              <Badge color="red">Red</Badge>
              <span>Structural issues found — house fails assessment</span>
            </div>
          </div>
        </StepCard>

        <StepCard step={4} title="Next Steps">
          <p>
            For <Badge color="green">Green</Badge> or <Badge color="yellow">Yellow</Badge> results,
            CSOs can proceed to register an opportunity in Salesforce.{" "}
            <Badge color="red">Red</Badge> results indicate the house is not eligible.
          </p>
        </StepCard>
      </div>
    </div>
  );
}

function OpportunitySection() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <SectionTitle subtitle="Salesforce Integration">Register Opportunity</SectionTitle>
        <p className="mt-3 text-sm text-brand-black/45 max-w-xl leading-relaxed">
          After a qualifying assessment, CSOs register the opportunity in Salesforce.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <StepCard step={1} title="Customer Check">
          <p className="mb-3">Does the customer already have company products?</p>
          <div className="space-y-2.5">
            <div className="flex items-start gap-3 rounded-xl bg-brand-orange/[0.04] px-4 py-3 ring-1 ring-brand-orange/10">
              <Badge color="orange">Yes</Badge>
              <span>Search for the existing customer by name or phone. Select from results.</span>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-brand-black/[0.02] px-4 py-3 ring-1 ring-brand-black/[0.04]">
              <Badge color="gray">No</Badge>
              <span>Fill in customer details (salutation, name, phone). A Contact and Account are created in Salesforce.</span>
            </div>
          </div>
        </StepCard>

        <StepCard step={2} title="Fill Opportunity Form">
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-brand-black text-[13px] mb-1.5">Location</p>
              <p>Select country and search for the village. Cell, sector, and district are shown automatically.</p>
            </div>
            <div>
              <p className="font-semibold text-brand-black text-[13px] mb-2">Opportunity Details</p>
              <ul className="space-y-1.5">
                <ListItem><span><strong>Category:</strong> Above Social Registry (no discount) or Below Social Registry (discount allowed)</span></ListItem>
                <ListItem><span><strong>House &amp; Phase:</strong> Select from Salesforce picklists</span></ListItem>
                <ListItem><span><strong>Total SQM:</strong> Enter total square meters</span></ListItem>
                <ListItem><span><strong>Product Interest:</strong> Floor Standard Clear/Color, Plaster Interior/Exterior</span></ListItem>
                <ListItem><span><strong>Employee:</strong> Search for the employee who signed the contract</span></ListItem>
                <ListItem><span><strong>Signed Date:</strong> Date the customer signed</span></ListItem>
              </ul>
            </div>
          </div>
        </StepCard>

        <StepCard step={3} title="Submit">
          <p className="mb-3">On submission, the system creates:</p>
          <ul className="space-y-1.5 mb-4">
            <ListItem>A Contact and Account in Salesforce (new customers only)</ListItem>
            <ListItem>An Opportunity linked to the customer&apos;s Contact and Account</ListItem>
          </ul>
          <div className="rounded-xl bg-gradient-to-r from-brand-black/[0.03] to-brand-black/[0.01] px-4 py-3 ring-1 ring-brand-black/[0.05]">
            <p className="text-xs">
              Opportunity name format: <code className="rounded-md bg-white px-2 py-0.5 text-[11px] font-bold text-brand-orange shadow-sm ring-1 ring-brand-orange/10">FirstName LastName House# - Phase#</code>
              <br />
              <span className="text-brand-black/35">Salesforce automation appends the district, year, and customer code suffix.</span>
            </p>
          </div>
        </StepCard>

        <div className="rounded-2xl border border-brand-black/[0.06] bg-white p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-black/[0.04]">
              <svg className="h-4 w-4 text-brand-black/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 0v1.5c0 .621-.504 1.125-1.125 1.125" />
              </svg>
            </div>
            <h3 className="text-[15px] font-bold text-brand-black">Salesforce Field Mapping</h3>
          </div>
          <div className="overflow-x-auto rounded-xl ring-1 ring-brand-black/[0.06]">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="bg-brand-black/[0.02]">
                  <th className="px-4 py-3 font-bold text-brand-black/50 text-[11px] uppercase tracking-wider">Form Field</th>
                  <th className="px-4 py-3 font-bold text-brand-black/50 text-[11px] uppercase tracking-wider">Salesforce Field</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-black/[0.04]">
                {[
                  ["Customer", "Customer__c"],
                  ["Account", "AccountId"],
                  ["Country", "Country__c"],
                  ["Village", "Umudugudu__c"],
                  ["House", "House__c"],
                  ["Phase", "Phase__c"],
                  ["Total SQM", "Total_Square_Meters__c"],
                  ["Product Interest", "New_Product_Interest__c"],
                  ["Employee", "Signed_By_Employee__c"],
                  ["Signed Date", "Customer_Signed_Date__c"],
                  ["Category", "Discount_2026_allowed__c"],
                  ["Stage", "StageName (Closed Won)"],
                ].map(([form, sf]) => (
                  <tr key={form} className="hover:bg-brand-orange/[0.02] transition-colors">
                    <td className="px-4 py-2.5 text-brand-black/60">{form}</td>
                    <td className="px-4 py-2.5">
                      <code className="rounded-md bg-brand-orange/[0.06] px-2 py-0.5 text-[11px] font-semibold text-brand-orange">{sf}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function ApiSection() {
  const [openEndpoint, setOpenEndpoint] = useState<string | null>(null);

  const endpoints = [
    {
      id: "login",
      method: "POST",
      path: "/api/auth/login",
      description: "Login with username and password",
      auth: false,
      request: `{
  "username": "cso@earthenable.org",
  "password": "..."
}`,
      response: `{
  "access_token": "eyJhbG...",
  "token_type": "bearer"
}`,
    },
    {
      id: "google",
      method: "POST",
      path: "/api/auth/google",
      description: "Login with Google OAuth",
      auth: false,
      request: `{
  "credential": "google_id_token"
}`,
      response: `{
  "access_token": "eyJhbG...",
  "token_type": "bearer"
}`,
    },
    {
      id: "me",
      method: "GET",
      path: "/api/auth/me",
      description: "Get current user",
      auth: true,
      request: null,
      response: `{
  "username": "cso@earthenable.org",
  "name": "CSO User"
}`,
    },
    {
      id: "picklists",
      method: "GET",
      path: "/api/sf/picklists",
      description: "Get form picklist values",
      auth: true,
      request: null,
      response: `{
  "house": ["1", "2", ...],
  "phase": ["1", "2", ...],
  "category": ["Above Social Registry", "Below Social Registry"],
  "country": ["Rwanda", "Uganda", "Kenya"],
  "productInterest": ["Floor_Standard Clear | DirectSale", ...]
}`,
    },
    {
      id: "villages",
      method: "GET",
      path: "/api/sf/villages?q={query}",
      description: "Search villages (min 2 chars)",
      auth: true,
      request: null,
      response: `[{
  "id": "a205J000...",
  "name": "Nyamata II",
  "cell": "Nyamata",
  "sector": "Nyamata",
  "district": "Bugesera",
  "country": "Rwanda"
}]`,
    },
    {
      id: "employees",
      method: "GET",
      path: "/api/sf/employees?q={query}",
      description: "Search employees (min 2 chars)",
      auth: true,
      request: null,
      response: `[{
  "id": "003AZ000...",
  "name": "Alfred Ntaganda",
  "phone": "0788000000",
  "advancementLevel": "Sales Agent",
  "workLocation": "Bugesera"
}]`,
    },
    {
      id: "customers",
      method: "GET",
      path: "/api/sf/customers?q={query}",
      description: "Search customer accounts (min 2 chars)",
      auth: true,
      request: null,
      response: `[{
  "id": "001a2000...",
  "name": "Muhire Philos",
  "firstName": "Muhire",
  "lastName": "Philos",
  "phone": "0789058711",
  "district": "Bugesera",
  "contactId": "003a2000...",
  "customerCode": "065051"
}]`,
    },
    {
      id: "opportunity",
      method: "POST",
      path: "/api/sf/opportunity",
      description: "Create opportunity",
      auth: true,
      request: `{
  "firstName": "Muhire",
  "lastName": "Philos",
  "customerSignedDate": "2026-03-09",
  "accountId": "001a2000...",
  "existingContactId": "003a2000...",
  "country": "Rwanda",
  "villageId": "a205J000...",
  "category": "Above Social Registry",
  "house": "5",
  "phase": "5",
  "totalSquareMeters": 4.8,
  "productInterest": "Floor_Standard Clear | DirectSale",
  "employeeId": "003AZ000..."
}`,
      response: `{
  "id": "006AZ00000abc...",
  "success": true
}`,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <SectionTitle subtitle="Reference">API Endpoints</SectionTitle>

      <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-brand-orange/[0.06] to-brand-orange/[0.02] px-5 py-4 ring-1 ring-brand-orange/10">
        <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl bg-brand-orange text-white shadow-sm shadow-brand-orange/20">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <p className="text-[13px] text-brand-black/55">
          Endpoints marked <Badge color="orange">AUTH</Badge> require a JWT token:{" "}
          <code className="rounded-md bg-white px-2 py-0.5 text-[11px] font-semibold text-brand-black/60 shadow-sm ring-1 ring-brand-black/[0.06]">Authorization: Bearer &lt;token&gt;</code>
        </p>
      </div>

      <div className="flex flex-col gap-2">
        {endpoints.map((ep) => (
          <div key={ep.id} className="rounded-2xl border border-brand-black/[0.06] bg-white overflow-hidden transition-all duration-200 hover:shadow-md hover:shadow-brand-black/[0.04]">
            <button
              onClick={() => setOpenEndpoint(openEndpoint === ep.id ? null : ep.id)}
              className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition"
            >
              <span
                className={`rounded-lg px-2.5 py-1 text-[11px] font-bold tracking-wide ${
                  ep.method === "GET"
                    ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/60"
                    : "bg-blue-50 text-blue-600 ring-1 ring-blue-200/60"
                }`}
              >
                {ep.method}
              </span>
              <code className="text-[13px] font-semibold text-brand-black/80">{ep.path}</code>
              {ep.auth && <Badge color="orange">AUTH</Badge>}
              <span className="ml-auto hidden text-[12px] text-brand-black/30 sm:block">{ep.description}</span>
              <svg
                className={`h-4 w-4 flex-shrink-0 text-brand-black/20 transition-transform duration-200 ${openEndpoint === ep.id ? "rotate-180" : ""}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {openEndpoint === ep.id && (
              <div className="border-t border-brand-black/[0.04] px-5 py-5 space-y-4 animate-slide-down bg-[#FAFAFA]">
                <p className="text-[13px] text-brand-black/45 sm:hidden">{ep.description}</p>
                {ep.request && (
                  <div>
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-brand-black/25">Request Body</p>
                    <pre className="overflow-x-auto rounded-xl bg-brand-black/[0.04] p-4 text-[12px] text-brand-black/65 leading-relaxed font-mono ring-1 ring-brand-black/[0.04]">
                      {ep.request}
                    </pre>
                  </div>
                )}
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.15em] text-brand-black/25">Response</p>
                  <pre className="overflow-x-auto rounded-xl bg-brand-black/[0.04] p-4 text-[12px] text-brand-black/65 leading-relaxed font-mono ring-1 ring-brand-black/[0.04]">
                    {ep.response}
                  </pre>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
