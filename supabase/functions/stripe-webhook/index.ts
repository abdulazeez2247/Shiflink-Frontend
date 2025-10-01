
// import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
// import Stripe from "https://esm.sh/stripe@14.21.0";
// import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
//   apiVersion: "2023-10-16",
// });

// const cryptoProvider = Stripe.createSubtleCryptoProvider();

// serve(async (req) => {
//   const signature = req.headers.get("stripe-signature");
//   const body = await req.text();
  
//   if (!signature) {
//     return new Response("No signature", { status: 400 });
//   }

//   let event;
//   try {
//     event = await stripe.webhooks.constructEventAsync(
//       body,
//       signature,
//       Deno.env.get("STRIPE_WEBHOOK_SECRET") || "",
//       undefined,
//       cryptoProvider
//     );
//   } catch (err) {
//     console.error("Webhook signature verification failed:", err.message);
//     return new Response("Invalid signature", { status: 400 });
//   }

//   const supabase = createClient(
//     Deno.env.get("SUPABASE_URL") ?? "",
//     Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
//     { auth: { persistSession: false } }
//   );

//   try {
//     switch (event.type) {
//       case "checkout.session.completed": {
//         const session = event.data.object as Stripe.Checkout.Session;
        
//         if (session.payment_status === "paid") {
//           // Update enrollment status
//           const { error } = await supabase
//             .from("course_enrollments")
//             .update({ 
//               payment_status: "paid",
//               amount_paid: (session.amount_total || 0) / 100
//             })
//             .eq("stripe_payment_intent_id", session.id);

//           if (error) {
//             console.error("Error updating enrollment:", error);
//           } else {
//             console.log("Successfully updated enrollment for session:", session.id);
//           }
//         }
//         break;
//       }
      
//       case "payment_intent.payment_failed": {
//         const paymentIntent = event.data.object as Stripe.PaymentIntent;
        
//         // Update enrollment status to failed
//         const { error } = await supabase
//           .from("course_enrollments")
//           .update({ payment_status: "failed" })
//           .eq("stripe_payment_intent_id", paymentIntent.id);

//         if (error) {
//           console.error("Error updating failed payment:", error);
//         }
//         break;
//       }
//     }

//     return new Response(JSON.stringify({ received: true }), {
//       status: 200,
//       headers: { "Content-Type": "application/json" },
//     });
//   } catch (error) {
//     console.error("Webhook handler error:", error);
//     return new Response("Webhook handler failed", { status: 500 });
//   }
// });
