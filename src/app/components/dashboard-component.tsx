"use client";
import InvoiceTable from "@/app/components/InoviceTable";
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function Dashboard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [itemList, setItemList] = useState<Item[]>([]);
  const [customer, setCustomer] = useState<string>("");
  const [invoiceTitle, setInvoiceTitle] = useState<string>("");
  const [itemCost, setItemCost] = useState<number>(1);
  const [itemQuantity, setItemQuantity] = useState<number>(1);
  const [itemName, setItemName] = useState<string>("");
  const [customers, setCustomers] = useState([]);
  const [bankInfoExists, setBankInfoExists] = useState<boolean>(false);
  const router = useRouter();

  const fetchBankInfo = useCallback(async () => {
    try {
      const response = await fetch(`/api/bank-info?userID=${user?.id}`);
      const data = await response.json();
      if (data?.bankInfo[0]) {
        setBankInfoExists(true);
      }
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  const fetchCustomers = useCallback(async () => {
    try {
      const res = await fetch(`/api/customers?userID=${user?.id}`);
      const data = await res.json();
      setCustomers(data.customers);
    } catch (err) {
      console.log(err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchBankInfo();
      if (bankInfoExists) {
        fetchCustomers();
      }
    }
  }, [fetchCustomers, user, fetchBankInfo, bankInfoExists]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (itemName.trim() && itemCost > 0 && itemQuantity >= 1) {
      setItemList([
        ...itemList,
        {
          id: Math.random().toString(36).substring(2, 9),
          name: itemName,
          cost: itemCost,
          quantity: itemQuantity,
          price: itemCost * itemQuantity,
        },
      ]);
    }
    setItemName("");
    setItemCost(0);
    setItemQuantity(0);
  };

  const getTotalAmount = () =>
    itemList.reduce((total, item) => total + item.price, 0);

  const createInvoice = async () => {
    try {
      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer,
          title: invoiceTitle,
          items: itemList,
          total: getTotalAmount(),
          ownerID: user?.id,
        }),
      });
      const data = await res.json();
      toast.success(data.message);
      router.push("/history");
    } catch (err) {
      console.log(err);
    }
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!customer || !invoiceTitle || !itemList.length || itemName) {
      alert("Please fill all fields");
      return;
    }
    createInvoice();
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <main className="min-h-[90vh] flex items-start p-6">
        {!bankInfoExists ? (
          <div className="w-full h-screen flex flex-col items-center justify-center">
            <p className="text-xl font-semibold mb-4">
              Welcome, please add bank information to start using the
              application!
            </p>
            <Link href="/settings">
              <Button variant="destructive">Add Bank Info</Button>
            </Link>
          </div>
        ) : (
          <div className="w-full h-full">
            <h1 className="text-2xl font-bold mb-6">Add New Invoice</h1>

            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <Label>Customer</Label>
              {customers.length > 0 ? (
                <Select onValueChange={(value) => setCustomer(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer: any) => (
                      <SelectItem key={customer.id} value={customer.name}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm text-red-500">
                  No customers found. Please add a customer.
                </p>
              )}

              <Label htmlFor="title">Invoice Title</Label>
              <Input
                id="title"
                required
                value={invoiceTitle}
                onChange={(e) => setInvoiceTitle(e.target.value)}
              />

              <Separator className="my-6" />

              <h3 className="text-lg font-bold mb-4">Items List</h3>
              <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <Input
                  type="text"
                  placeholder="Item Name"
                  className="flex-1"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
                <div className="flex items-center space-x-2 w-full md:w-1/4">
                  <p>Price</p>
                  <Input
                    type="number"
                    placeholder="Cost"
                    className="w-full md:w-24"
                    value={itemCost}
                    onChange={(e) => setItemCost(Number(e.target.value))}
                  />
                </div>
                <div className="flex items-center space-x-2 w-full md:w-1/4">
                  <p>Quantity</p>
                  <Input
                    type="number"
                    placeholder="Quantity"
                    className="w-full md:w-24"
                    value={itemQuantity}
                    onChange={(e) => setItemQuantity(Number(e.target.value))}
                  />
                </div>
                <Button
                  type="button"
                  className="w-full md:w-auto"
                  onClick={handleAddItem}
                >
                  Add Item
                </Button>
              </div>

              <InvoiceTable itemList={itemList} />

              <Button type="submit" className="w-full mt-6">
                Save & Preview Invoice
              </Button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
