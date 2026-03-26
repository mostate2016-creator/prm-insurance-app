import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Heart, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { sendEmailNotification, formatLifeQuoteEmail } from "@/lib/emailNotify";
import { insertLifeQuoteSchema, type InsertLifeQuote } from "@shared/schema";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
];

const STEPS = ["Contact Info", "Personal Details", "Health & Lifestyle", "Coverage"];

export default function LifeQuotePage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertLifeQuote>({
    resolver: zodResolver(insertLifeQuoteSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "MO",
      zip: "",
      dateOfBirth: "",
      gender: "",
      height: "",
      weight: "",
      tobaccoUse: "",
      generalHealth: "",
      majorHealthConditions: "",
      coverageAmount: "",
      policyType: "",
      currentInsurer: "",
      beneficiary: "",
      additionalNotes: "",
      createdAt: new Date().toISOString(),
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertLifeQuote) => {
      const res = await apiRequest("POST", "/api/quotes/life", { ...data, createdAt: new Date().toISOString() });
      return res.json();
    },
    onSuccess: (_data, variables) => {
      setSubmitted(true);
      const emailData = formatLifeQuoteEmail(variables);
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
    let fieldsToValidate: (keyof InsertLifeQuote)[] = [];
    switch (step) {
      case 0:
        fieldsToValidate = ["firstName", "lastName", "email", "phone", "address", "city", "state", "zip"];
        break;
      case 1:
        fieldsToValidate = ["dateOfBirth", "gender"];
        break;
      case 2:
        fieldsToValidate = ["tobaccoUse", "generalHealth"];
        break;
      case 3:
        fieldsToValidate = ["coverageAmount", "policyType"];
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

  const onSubmit = (data: InsertLifeQuote) => {
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
              Thank you for requesting a life insurance quote from PRM Insurance.
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
        <footer className="py-4 text-center"><PerplexityAttribution /></footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex items-center gap-2 text-primary">
            <Heart className="w-5 h-5" />
            <span className="font-semibold text-sm">Life Insurance Quote</span>
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

              {/* Step 2: Personal Details */}
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Personal Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date of Birth</FormLabel>
                        <FormControl><Input type="date" {...field} data-testid="input-dob" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="gender" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-gender"><SelectValue placeholder="Select gender" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="height" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Height (Optional)</FormLabel>
                          <FormControl><Input placeholder="5'10&quot;" {...field} data-testid="input-height" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="weight" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weight in lbs (Optional)</FormLabel>
                          <FormControl><Input placeholder="170" {...field} data-testid="input-weight" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Health & Lifestyle */}
              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Health & Lifestyle</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField control={form.control} name="tobaccoUse" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Do you use tobacco products?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-tobacco"><SelectValue placeholder="Select" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="no">No</SelectItem>
                            <SelectItem value="yes">Yes</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="generalHealth" render={({ field }) => (
                      <FormItem>
                        <FormLabel>How would you describe your general health?</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-health"><SelectValue placeholder="Select health status" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="excellent">Excellent</SelectItem>
                            <SelectItem value="good">Good</SelectItem>
                            <SelectItem value="average">Average</SelectItem>
                            <SelectItem value="below-average">Below Average</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="majorHealthConditions" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Any major health conditions? (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="List any major health conditions, surgeries, or ongoing treatments..."
                            rows={3}
                            {...field}
                            data-testid="input-health-conditions"
                          />
                        </FormControl>
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
                    <FormField control={form.control} name="coverageAmount" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Desired Coverage Amount</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-coverage-amount"><SelectValue placeholder="Select coverage amount" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="$50,000">$50,000</SelectItem>
                            <SelectItem value="$100,000">$100,000</SelectItem>
                            <SelectItem value="$250,000">$250,000</SelectItem>
                            <SelectItem value="$500,000">$500,000</SelectItem>
                            <SelectItem value="$750,000">$750,000</SelectItem>
                            <SelectItem value="$1,000,000">$1,000,000</SelectItem>
                            <SelectItem value="not-sure">Not Sure — Help Me Decide</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="policyType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Policy Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-policy-type"><SelectValue placeholder="Select policy type" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="term">Term Life</SelectItem>
                            <SelectItem value="whole">Whole Life</SelectItem>
                            <SelectItem value="universal">Universal Life</SelectItem>
                            <SelectItem value="not-sure">Not Sure — Help Me Decide</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="beneficiary" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Beneficiary (Optional)</FormLabel>
                        <FormControl><Input placeholder="Spouse, children, etc." {...field} data-testid="input-beneficiary" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="currentInsurer" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Life Insurance Company (Optional)</FormLabel>
                        <FormControl><Input placeholder="State Farm, Geico, etc." {...field} data-testid="input-current-insurer" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="additionalNotes" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any additional details about your life insurance needs..."
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

      <footer className="py-4 text-center border-t border-border">
        <PerplexityAttribution />
      </footer>
    </div>
  );
}
