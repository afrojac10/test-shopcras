// "use client"
//
//
// import Image from "next/image";
//
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import { Button } from "@/components/ui/button"
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import {useState} from "react";
//
// // const formSchema = z.object({
// //   username: z.string().min(2, {
// //     message: "Username must be at least 2 characters.",
// //   }),
// // })
//
// const formSchema = z.object({
//   email: z.string().email(),
//   // phoneNumber: z.string().max(12),
//   // postal: z.string(),
//   // city: z.string(),
//   firstName: z.string(),
//   lastName: z.string(),
//   // address: z.string(),
//   amount: z.string(),
// });
//
// export default function Home(){
//     const [splitPayment, setSplitPayment] = useState<number>(1);
//
// const form = useForm<z.infer<typeof formSchema>>({
//   resolver: zodResolver(formSchema),
//   // defaultValues: {
//   //   username: "",
//   // },
// })
//
//
//   const handlePayment = async () => {
//     const apiUrl = "https://api.merchant.staging.ercaspay.com/api/v1";
//     const accessToken = "ECRS-TEST-SKLJGmc0iMds9alInDZSyCLl2zg6eSeClss0dQgCAZ"; // Replace with actual token
//     const redirectUrl = "https://omolabakeventures.com";
//
//     const requestBody = {
//       amount: 100,
//       paymentReference: "R5md7gd9b4s3h2j5d67g",
//       paymentMethods: "card,bank-transfer,ussd,qrcode",
//       customerName: "ShopCras",
//       customerEmail: "shopcras@dev.com",
//       customerPhoneNumber: "09061626364",
//       redirectUrl,
//       description: "The description for this payment goes here",
//       currency: "NGN",
//       feeBearer: "customer",
//       metadata: {
//         firstname: "Ola",
//         lastname: "Benson",
//         email: "iie@mail.com",
//       },
//     };
//
//     try {
//       const response = await fetch(apiUrl + "/payment/initiate", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${accessToken}`,
//         },
//         body: JSON.stringify(requestBody),
//       });
//
//
//
//       const result = await response.json();
//
//       if (response.ok) {
//         // Redirect to the success URL
//         console.log(result);
//         window.location.href = redirectUrl;
//       } else {
//         console.error("Payment failed:", result);
//         console.log(`Payment failed: ${result.message || "Unknown error"}`);
//       }
//     } catch (error) {
//       console.error("An error occurred:", error);
//       console.log("An unexpected error occurred. Please try again.");
//     }
//   };
//
//
// function onSubmit(values: z.infer<typeof formSchema>) {
//   // Do something with the form values.
//   // ✅ This will be type-safe and validated.
//   console.log(values)
// }
//
//   return (
//     <div className="items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//           <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Email" {...field} />
//                     </FormControl>
//
//                     <FormMessage />
//                   </FormItem>
//               )}
//           />
//
//           <FormField
//               control={form.control}
//               name="firstName"
//               render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>First Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="First Name" {...field} />
//                     </FormControl>
//
//                     <FormMessage />
//                   </FormItem>
//               )}
//           />  <FormField
//               control={form.control}
//               name="lastName"
//               render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Last Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="First Name" {...field} />
//                     </FormControl>
//
//                     <FormMessage />
//                   </FormItem>
//               )}
//           />
//
//           <FormField
//               control={form.control}
//               name="amount"
//               render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Amount</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Amount" {...field} />
//                     </FormControl>
//
//                     <FormMessage />
//                   </FormItem>
//               )}
//           />
//
// <div className="px-8">
//     <Button className="mx-8" type="submit">Submit</Button>
//     <Button onClick={()=> setSplitPayment()}>Split payment</Button>
// </div>
//
//
//         </form>
//       </Form>
//     </div>
//   );



"use client"

import React, { useState } from "react";
import axios from "axios";

const PaymentForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        amount: "",
    });

    const [splitAmount, setSplitAmount] = useState<number | null>(null);
    const [responseMessage, setResponseMessage] = useState("");

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const finalAmount = splitAmount || Number(formData.amount); // Use splitAmount if it's set
        const dataToSend = {
            ...formData,
            amount: finalAmount,
        };

        try {
            const response = await axios.post("https://your-api-endpoint.com/submit", dataToSend);
            setResponseMessage("Submission successful: " + response.data.message);
        } catch (error: any) {
            setResponseMessage(
                "Error: " + (error.response?.data?.message || error.message)
            );
        }
    };

    // Handle payment splitting
    const handleSplit = (percentage: number) => {
        const originalAmount = Number(formData.amount);
        if (isNaN(originalAmount) || originalAmount <= 0) {
            setResponseMessage("Please enter a valid amount before splitting.");
            return;
        }
        const splitValue = originalAmount * (percentage / 100);
        setSplitAmount(splitValue);
    };

    return (
        <div>
            <h1>Payment Form</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="amount">Amount:</label>
                    <input
                        type="number"
                        id="amount"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <button type="button" onClick={() => handleSplit(20)}>
                        Split Payment by 20%
                    </button>
                    <button type="button" onClick={() => handleSplit(50)}>
                        Split Payment by 50%
                    </button>
                </div>
                {splitAmount !== null && (
                    <p>Split Amount: {splitAmount.toFixed(2)}</p>
                )}
                <button type="submit">Submit</button>
            </form>
            {responseMessage && <p>{responseMessage}</p>}
        </div>
    );
};

export default PaymentForm;

