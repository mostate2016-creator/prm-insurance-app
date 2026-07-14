import { useState } from "react";
import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowLeft, Home, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { sendEmailNotification, formatHomeQuoteEmail } from "@/lib/emailNotify";
import { insertHomeQuoteSchema, type InsertHomeQuote } from "@shared/schema";
import { PerplexityAttribution } from "@/components/PerplexityAttribution";
import { LegalFooterLinks } from "@/components/LegalFooterLinks";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD",
  "MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC",
  "SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
];

const STEPS = ["Contact Info", "Property Details", "Home Features", "Additional Info"];

export default function HomeQuotePage() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertHomeQuote>({
    resolver: zodResolver(insertHomeQuoteSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      propertyAddress: "",
      propertyCity: "",
      propertyState: "MO",
      propertyZip: "",
      propertyType: "",
      yearBuilt: "",
      squareFootage: "",
      numberOfBedrooms: "",
      numberOfBathrooms: "",
      roofType: "",
      hasPool: "no",
      hasSecuritySystem: "no",
      currentInsurer: "",
      estimatedHomeValue: "",
      additionalNotes: "",
      createdAt: new Date().toISOString(),
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertHomeQuote) => {
      const res = await apiRequest("POST", "/api/quotes/home", { ...data, createdAt: new Date().toISOString() });
      return res.json();
    },
    onSuccess: (_data, variables) => {
      setSubmitted(true);
      // Send email notification (non-blocking)
      const emailData = formatHomeQuoteEmail(variables);
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
    let fieldsToValidate: (keyof InsertHomeQuote)[] = [];
    switch (step) {
      case 0:
        fieldsToValidate = ["firstName", "lastName", "email", "phone"];
        break;
      case 1:
        fieldsToValidate = ["propertyAddress", "propertyCity", "propertyState", "propertyZip", "propertyType"];
        break;
      case 2:
        fieldsToValidate = ["yearBuilt", "squareFootage", "numberOfBedrooms", "numberOfBathrooms"];
        break;
      case 3:
        // Optional fields
        break;
    }
    if (fieldsToValidate.length === 0) return true;
    const result = await form.trigger(fieldsToValidate);
    return result;
  };

  const handleNext = async () => {
    const valid = await validateStep();
    if (valid) setStep((s) => Math.min(s + 1, 3));
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = (data: InsertHomeQuote) => {
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
              Thank you for requesting a home insurance quote from PRM Insurance.
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
            <Home className="w-5 h-5" />
            <span className="font-semibold text-sm">Home Insurance Quote</span>
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
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Property Details */}
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Property Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField control={form.control} name="propertyAddress" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Address</FormLabel>
                        <FormControl><Input placeholder="123 Elm St" {...field} data-testid="input-property-address" /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      <div className="col-span-2 sm:col-span-1">
                        <FormField control={form.control} name="propertyCity" render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl><Input placeholder="Springfield" {...field} data-testid="input-property-city" /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                      <FormField control={form.control} name="propertyState" render={({ field }) => (
                        <FormItem>
                          <FormLabel>State</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-property-state"><SelectValue /></SelectTrigger>
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
                      <FormField control={form.control} name="propertyZip" render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP</FormLabel>
                          <FormControl><Input placeholder="65801" {...field} data-testid="input-property-zip" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="propertyType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Property Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-property-type"><SelectValue placeholder="Select property type" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="single-family">Single Family Home</SelectItem>
                            <SelectItem value="townhouse">Townhouse</SelectItem>
                            <SelectItem value="condo">Condo</SelectItem>
                            <SelectItem value="duplex">Duplex</SelectItem>
                            <SelectItem value="manufactured">Manufactured / Mobile Home</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Home Features */}
              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Home Features</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="yearBuilt" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Year Built</FormLabel>
                          <FormControl><Input placeholder="1995" {...field} data-testid="input-year-built" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="squareFootage" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Square Footage</FormLabel>
                          <FormControl><Input placeholder="1,800" {...field} data-testid="input-sqft" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="numberOfBedrooms" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bedrooms</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-bedrooms"><SelectValue placeholder="Select" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {["1","2","3","4","5","6+"].map((n) => (
                                <SelectItem key={n} value={n}>{n}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="numberOfBathrooms" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bathrooms</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-bathrooms"><SelectValue placeholder="Select" /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {["1","1.5","2","2.5","3","3.5","4+"].map((n) => (
                                <SelectItem key={n} value={n}>{n}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 4: Additional Info */}
              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Additional Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField control={form.control} name="roofType" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Roof Type (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                          <FormControl>
                            <SelectTrigger data-testid="select-roof-type"><SelectValue placeholder="Select roof type" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="asphalt-shingle">Asphalt Shingle</SelectItem>
                            <SelectItem value="metal">Metal</SelectItem>
                            <SelectItem value="tile">Tile</SelectItem>
                            <SelectItem value="wood-shake">Wood Shake</SelectItem>
                            <SelectItem value="slate">Slate</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <FormField control={form.control} name="hasPool" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Swimming Pool?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value || "no"}>
                            <FormControl>
                              <SelectTrigger data-testid="select-pool"><SelectValue /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="no">No</SelectItem>
                              <SelectItem value="yes">Yes</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="hasSecuritySystem" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Security System?</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value || "no"}>
                            <FormControl>
                              <SelectTrigger data-testid="select-security"><SelectValue /></SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="no">No</SelectItem>
                              <SelectItem value="yes">Yes</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="estimatedHomeValue" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Home Value (Optional)</FormLabel>
                        <FormControl><Input placeholder="$250,000" {...field} data-testid="input-home-value" /></FormControl>
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
                    <FormField control={form.control} name="additionalNotes" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any additional details about your home or coverage needs..."
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
