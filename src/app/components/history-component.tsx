"use client";
import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

import SideNav from "@/app/components/SideNav";

export default function History() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const fetchInvoices = useCallback(async () => {
    try {
      const res = await fetch(`/api/invoices?userID=${user?.id}`);
      const data = await res.json();
      setInvoices(data.invoices);
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  if (!isSignedIn || !isLoaded) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
            <div className="aspect-video rounded-xl bg-muted/50" />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <main className="min-h-[90vh] flex items-start">
        {/* <SideNav /> */}

        <div className="md:w-5/6 w-full h-full p-6">
          <h2  className="mb-2 font-bold">History</h2>
          <p  className="opacity-70 mb-4 text-sm">
            View all your invoices and their status
          </p>

          {invoices.length > 0 ? (
            invoices.map((invoice) => (
              <Card className="w-full mb-3" key={invoice.id}>
                <CardHeader>
                  <CardTitle>Invoice - #0{invoice.id}</CardTitle>
                  <CardDescription>
                    Issued to <span className="font-bold">{invoice.customer_id}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div>
                    <p  className="font-bold text-lg">
                      {Number(invoice.total_amount).toLocaleString()}
                    </p>
                  </div>
                  <Link
                    href={{
                      pathname: `/invoices/${invoice.id}`,
                      query: { customer: invoice.customer_id },
                    }}
                    passHref
                  >
                    <Button >Preview</Button>
                  </Link>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-red-500 text-lg">No invoices found</p>
          )}
        </div>
      </main>
    </div>
  );
}

