import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Car, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { sendEmailNotification, formatAutoQuoteEmail } from "@/lib/emailNotify";
import { insertAutoQuoteSchema, type InsertAutoQuote } from "@shared/schema";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import { LegalFooterLinks } from "@/components/LegalFooterLinks";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
];

const STEPS = ["Contact Info", "Vehicle Details", "Driver Info", "Coverage"];

export default function AutoQuotePage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertAutoQuote>({
    resolver: zodResolver(insertAutoQuoteSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "MO",
      zip: "",
      vehicleYear: "",
      vehicleMake: "",
      vehicleModel: "",
      vin: "",
      dateOfBirth: "",
      licenseNumber: "",
      currentInsurer: "",
      coverageType: "",
      additionalNotes: "",
      createdAt: new Date().toISOString(),
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertAutoQuote) => {
      const res = await apiRequest("POST", "/api/quotes/auto", { ...data, createdAt: new Date().toISOString() });
      return res.json();
    },
    onSuccess: (_data, variables) => {
      setSubmitted(true);
      // Send email notification (non-blocking)
      const emailData = formatAutoQuoteEmail(variables);
      sendEmailNotification(emailData).catch(() => {});
    },
    onError: (err: Error) => {
      toast({
        title: "Submission failed",
        description: err.message,
        variant: "destructive",
      });
    },
  });

  const validateStep = async () => {
    let fieldsToValidate: (keyof InsertAutoQuote)[] = [];
    switch (step) {
      case 0:
        fieldsToValidate = ["firstName", "lastName", "email", "phone", "address", "city", "state", "zip"];
        break;
      case 1:
        fieldsToValidate = ["vehicleYear", "vehicleMake", "vehicleModel"];
        break;
      case 2:
        fieldsToValidate = ["dateOfBirth"];
        break;
      case 3:
        fieldsToValidate = ["coverageType"];
        break;
    }
    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const valid = await validateStep();
    if (valid) setStep((s) => Math.min(s + 1, 3));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = (data: InsertAutoQuote) => {
    mutation.mutate(data);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <header className="border-b border-border bg-card">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
            <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <CheckCircle2 className="w-16 h-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2" data-testid="text-success-title">Quote Request Submitted</h2>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Thank you for requesting an auto insurance quote from PRM Insurance. 
              A member of our team will review your information and reach out within 1 business day.
            </p>
            <p className="text-sm font-medium mb-6">
              Questions? Call us at <a href="tel:4177661819" className="text-primary hover:underline">(417) 766-1819</a>
            </p>
            <Link href="/">
              <Button data-testid="button-back-home">Return Home</Button>
            </Link>
          </div>
        </main>
        <footer className="py-4 text-center space-y-2"><LegalFooterLinks /><PerplexityAttribution /></footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex items-center gap-2 text-primary">
            <Car className="w-5 h-5" />
            <span className="font-semibold text-sm">Auto Insurance Quote</span>
          </div>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Step Indicators */}
          <div className="flex items-center justify-center gap-1 mb-8" data-testid="step-indicators">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => i < step && setStep(i)}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                    i === step
                      ? "bg-primary text-primary-foreground"
                      : i < step
                      ? "bg-primary/15 text-primary cursor-pointer"
                      : "bg-muted text-muted-foreground"
                  }`}
                  data-testid={`step-${i}`}
                >
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-white/20">
                    {i + 1}
                  </span>
                  <span className="hidden sm:inline">{label}</span>
                </button>
                {i < STEPS.length - 1 && <ChevronRight className="w-3 h-3 text-muted-foreground" />}
              </div>
            ))}
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Step 1: Contact Info */}
              {step === 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="firstName" render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl><Input placeholder="John" {...field} data-testid="input-first-name" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="lastName" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl><Input placeholder="Smith" {...field} data-testid="input-last-name" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl><Input type="email" placeholder="john@example.com" {...field} data-testid="input-email" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl><Input type="tel" placeholder="(417) 555-0123" {...field} data-testid="input-phone" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl><Input placeholder="123 Main St" {...field} data-testid="input-address" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="col-span-2 sm:col-span-1">
                        <FormField control={form.control} name="city" render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl><Input placeholder="Springfield" {...field} data-testid="input-city" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name="state" render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-state"><SelectValue /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {US_STATES.map((s) => (
                                <SelectItem key={s} value={s}>{s}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="zip" render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP</FormLabel>
                          <FormControl><Input placeholder="65801" {...field} data-testid="input-zip" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Vehicle Info */}
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Vehicle Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-3 gap-4">
                      <FormField control={form.control} name="vehicleYear" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year</FormLabel>
                          <FormControl><Input placeholder="2024" {...field} data-testid="input-vehicle-year" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="vehicleMake" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Make</FormLabel>
                          <FormControl><Input placeholder="Toyota" {...field} data-testid="input-vehicle-make" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="vehicleModel" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Model</FormLabel>
                          <FormControl><Input placeholder="Camry" {...field} data-testid="input-vehicle-model" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="vin" render={({ field }) => (
                      <FormItem>
                        <FormLabel>VIN (Optional)</FormLabel>
                        <FormControl><Input placeholder="1HGBH41JXMN109186" {...field} data-testid="input-vin" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Driver Info */}
              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Driver Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl><Input type="date" {...field} data-testid="input-dob" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="licenseNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Driver's License Number (Optional)</FormLabel>
                        <FormControl><Input placeholder="S123-4567-8901" {...field} data-testid="input-license" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="currentInsurer" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Insurance Company (Optional)</FormLabel>
                        <FormControl><Input placeholder="State Farm, Geico, etc." {...field} data-testid="input-current-insurer" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Coverage */}
              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Coverage Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField control={form.control} name="coverageType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Desired Coverage Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-coverage"><SelectValue placeholder="Select coverage type" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="liability">Liability Only</SelectItem>
                            <SelectItem value="standard">Standard (Liability + Collision)</SelectItem>
                            <SelectItem value="full">Full Coverage (Comprehensive)</SelectItem>
                            <SelectItem value="not-sure">Not Sure — Help Me Decide</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="additionalNotes" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any additional details about your vehicle or coverage needs..."
                            rows={4}
                            {...field}
                            data-testid="input-notes"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </CardContent>
                </Card>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleBack}
                  disabled={step === 0}
                  className="gap-1"
                  data-testid="button-back"
                >
                  <ChevronLeft className="w-4 h-4" /> Back
                </Button>
                {step < 3 ? (
                  <Button type="button" onClick={handleNext} className="gap-1" data-testid="button-next">
                    Next <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={mutation.isPending} data-testid="button-submit">
                    {mutation.isPending ? "Submitting..." : "Submit Quote Request"}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      </main>

      <footer className="py-4 text-center border-t border-border space-y-2">
        <LegalFooterLinks />
        <PerplexityAttribution />
      </footer>
    </div>
  );
}
