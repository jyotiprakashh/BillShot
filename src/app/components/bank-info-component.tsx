"use client";
import { ChangeEvent, useEffect, useState, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function Settings() {
  const { isLoaded, isSignedIn, user } = useUser();
  const [bankInfo, setBankInfo] = useState({
    account_name: "",
    account_number: 1234567890,
    bank_name: "",
    currency: "",
  });
  const [inputBankInfo, setInputBankInfo] = useState({
    accountName: "",
    accountNumber: 1234567890,
    bankName: "",
    currency: "",
  });

  const fetchBankInfo = useCallback(async () => {
    try {
      const response = await fetch(`/api/bank-info?userID=${user?.id}`);
      const data = await response.json();
      if (data) {
        setBankInfo(data.bankInfo[0]);
      }
    } catch (err) {
      console.error(err);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchBankInfo();
    }
  }, [bankInfo, user, fetchBankInfo]);

  const handleUpdateBankInfo = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setInputBankInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateBankInfo();
  };

  const updateBankInfo = async () => {
    try {
      const response = await fetch("/api/bank-info", {
        method: "POST",
        body: JSON.stringify({ userID: user?.id, ...inputBankInfo }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data) {
        // alert(data.message);
        toast.success(data.message);
      }
      setBankInfo({
        account_name: "",
        account_number: 1234567890,
        bank_name: "",
        currency: "",
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div>
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
        <div className="md:w-5/6 w-full h-full p-6">
          <h2 className="text-2xl font-bold">Bank Information</h2>
          <p className="opacity-70 mb-4">Update your bank account information</p>

          <div className="flex md:flex-row flex-col items-start justify-between w-full md:space-x-4">
            {bankInfo?.account_name && (
              <Card className="md:w-1/3 w-full h-full p-3">
                <CardHeader>
                  <CardTitle>Current Bank Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm opacity-75">Account Name: {bankInfo.account_name}</p>
                  <p className="text-sm opacity-75">Account Number: {bankInfo.account_number}</p>
                  <p className="text-sm opacity-75">Bank Name: {bankInfo.bank_name}</p>
                  <p className="text-sm opacity-75">Currency: {bankInfo.currency}</p>
                </CardContent>
              </Card>
            )}

            <form className="md:w-2/3 w-full p-3 flex flex-col" method="POST" onSubmit={handleSubmit}>
              <Label htmlFor="accountName" className="text-sm">Account Name</Label>
              <Input
                type="text"
                name="accountName"
                id="accountName"
                required
                value={inputBankInfo.accountName}
                onChange={handleUpdateBankInfo}
                className="mb-3"
              />

              <Label htmlFor="accountNumber" className="text-sm">Account Number</Label>
              <Input
                type="number"
                name="accountNumber"
                id="accountNumber"
                required
                value={inputBankInfo.accountNumber}
                onChange={handleUpdateBankInfo}
                className="mb-3"
              />

              <Label htmlFor="bankName" className="text-sm">Bank Name</Label>
              <Input
                type="text"
                name="bankName"
                id="bankName"
                required
                value={inputBankInfo.bankName}
                onChange={handleUpdateBankInfo}
                className="mb-3"
              />

              <Label htmlFor="currency" className="text-sm">Currency</Label>
              <Select
                name="currency"
                required
                onValueChange={(value) => setInputBankInfo((prev) => ({ ...prev, currency: value }))}
                value={inputBankInfo.currency}
              >
                <SelectTrigger className="mb-3">
                  <SelectValue placeholder="Select Currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=".">Select</SelectItem>
                  <SelectItem value="₹">Rupees</SelectItem>
                  <SelectItem value="$">USD</SelectItem>
                  <SelectItem value="€">EUR</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center justify-end">
                <Button type="submit" variant="default" className="w-[200px]">
                  Update Bank Info
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
