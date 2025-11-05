import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Upload, Building2, CheckCircle2, AlertCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LandlordOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  
  const [account, setAccount] = useState({
    type: "landlord" as "landlord" | "agent",
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
  });

  const [property, setProperty] = useState({
    developmentBrand: "",
    address: "",
    propertyType: "apartment" as "apartment" | "house" | "studio" | "maisonette" | "other",
    bedrooms: 1,
    bathrooms: 1,
    sizeSqFt: 0,
    sizeSqM: 0,
    furnished: "furnished" as "furnished" | "unfurnished" | "part",
    availableFrom: undefined as Date | undefined,
    rentPcm: 0,
    rentPw: 0,
    deposit: 0,
    councilTaxBand: "",
    epcRating: "",
    photos: [] as string[],
    floorplans: [] as string[],
    amenities: [] as string[],
    tenancyInfo: "",
  });

  const [requirements, setRequirements] = useState({
    incomeMultiple: 3.0,
    minTermMonths: 12,
    guarantorRequired: false,
    petsAllowed: false,
    studentsOk: false,
    smokingAllowed: false,
    maxOccupants: 2,
    docsRequired: [] as string[],
  });

  const [redFlags, setRedFlags] = useState({
    disallowAdverseCredit: false,
    disallowCCJs: false,
    disallowArrearsHistory: false,
    evictionsHistoryDisallowed: false,
    hmoRestrictions: "",
    otherNotes: "",
  });

  const [viewingSlots, setViewingSlots] = useState<Array<{ start: Date; end: Date }>>([]);

  const steps = [
    { title: "Account & Org", icon: Building2 },
    { title: "Property Basics", icon: Upload },
    { title: "Requirements", icon: CheckCircle2 },
    { title: "Red Flags & Viewings", icon: AlertCircle },
  ];

  const amenityOptions = [
    "gym", "yoga studio", "spin studio", "games room", "golf simulator",
    "coworking", "boardroom", "residents lounge", "terrace", "24/7 maintenance",
    "pet friendly", "bike storage", "parking", "wifi included", "concierge",
    "exclusive community", "fully managed", "social activities", "communal gardens",
    "private dining room", "security"
  ];

  const docsOptions = [
    { value: "id", label: "Photo ID" },
    { value: "payslip", label: "Recent Payslips" },
    { value: "address", label: "Proof of Address" },
    { value: "employment", label: "Employment Letter" },
    { value: "landlord_ref", label: "Previous Landlord Reference" },
    { value: "credit_report", label: "Credit Report" },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handlePublish();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handlePublish = () => {
    console.log("Publishing property:", {
      account,
      property,
      requirements,
      redFlags,
      viewingSlots,
    });
    // TODO: Submit to API
    alert("Property published! Redirecting to dashboard...");
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return account.contactName && account.email;
      case 1:
        return property.address && property.rentPcm > 0 && property.deposit > 0;
      case 2:
        return requirements.incomeMultiple > 0 && requirements.minTermMonths > 0;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div key={index} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex items-center justify-center w-10 h-10 rounded-full border-2",
                      isActive && "border-primary bg-primary text-primary-foreground",
                      isCompleted && "border-green-500 bg-green-500 text-white",
                      !isActive && !isCompleted && "border-muted-foreground/30 bg-muted text-muted-foreground"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="hidden md:block">
                    <div className={cn(
                      "text-sm font-medium",
                      isActive && "text-primary",
                      isCompleted && "text-green-600",
                      !isActive && !isCompleted && "text-muted-foreground"
                    )}>
                      {step.title}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "flex-1 h-0.5 mx-4",
                    isCompleted ? "bg-green-500" : "bg-muted"
                  )} />
                )}
              </div>
            );
          })}
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>
              {currentStep === 0 && "Tell us about yourself and your organization"}
              {currentStep === 1 && "Add property details, photos, and amenities"}
              {currentStep === 2 && "Set your tenant requirements and must-haves"}
              {currentStep === 3 && "Define red flags and add viewing slots"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Account & Org */}
            {currentStep === 0 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type" data-testid="label-account-type">Account Type</Label>
                  <Select
                    value={account.type}
                    onValueChange={(value: "landlord" | "agent") => setAccount({ ...account, type: value })}
                  >
                    <SelectTrigger data-testid="select-account-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="landlord">Landlord</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="companyName" data-testid="label-company">Company Name (Optional)</Label>
                  <Input
                    id="companyName"
                    data-testid="input-company"
                    value={account.companyName}
                    onChange={(e) => setAccount({ ...account, companyName: e.target.value })}
                    placeholder="Your Property Management Co."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactName" data-testid="label-contact-name">Contact Name *</Label>
                  <Input
                    id="contactName"
                    data-testid="input-contact-name"
                    value={account.contactName}
                    onChange={(e) => setAccount({ ...account, contactName: e.target.value })}
                    placeholder="John Smith"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" data-testid="label-email">Email *</Label>
                  <Input
                    id="email"
                    data-testid="input-email"
                    type="email"
                    value={account.email}
                    onChange={(e) => setAccount({ ...account, email: e.target.value })}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" data-testid="label-phone">Phone Number</Label>
                  <Input
                    id="phone"
                    data-testid="input-phone"
                    type="tel"
                    value={account.phone}
                    onChange={(e) => setAccount({ ...account, phone: e.target.value })}
                    placeholder="+44 7700 900000"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Property Basics */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="developmentBrand" data-testid="label-development">Development Brand (Optional)</Label>
                  <Input
                    id="developmentBrand"
                    data-testid="input-development"
                    value={property.developmentBrand}
                    onChange={(e) => setProperty({ ...property, developmentBrand: e.target.value })}
                    placeholder="e.g., Cortland"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" data-testid="label-address">Address *</Label>
                  <Input
                    id="address"
                    data-testid="input-address"
                    value={property.address}
                    onChange={(e) => setProperty({ ...property, address: e.target.value })}
                    placeholder="123 Main St, Manchester M1 1AA"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="propertyType" data-testid="label-property-type">Property Type *</Label>
                    <Select
                      value={property.propertyType}
                      onValueChange={(value: any) => setProperty({ ...property, propertyType: value })}
                    >
                      <SelectTrigger data-testid="select-property-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                        <SelectItem value="maisonette">Maisonette</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bedrooms" data-testid="label-bedrooms">Bedrooms *</Label>
                    <Input
                      id="bedrooms"
                      data-testid="input-bedrooms"
                      type="number"
                      min="0"
                      value={property.bedrooms}
                      onChange={(e) => setProperty({ ...property, bedrooms: parseInt(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms" data-testid="label-bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      data-testid="input-bathrooms"
                      type="number"
                      min="0"
                      step="0.5"
                      value={property.bathrooms}
                      onChange={(e) => setProperty({ ...property, bathrooms: parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="furnished" data-testid="label-furnished">Furnishing *</Label>
                    <Select
                      value={property.furnished}
                      onValueChange={(value: any) => setProperty({ ...property, furnished: value })}
                    >
                      <SelectTrigger data-testid="select-furnished">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="furnished">Furnished</SelectItem>
                        <SelectItem value="unfurnished">Unfurnished</SelectItem>
                        <SelectItem value="part">Part Furnished</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sizeSqFt" data-testid="label-size-sqft">Size (sq ft)</Label>
                    <Input
                      id="sizeSqFt"
                      data-testid="input-size-sqft"
                      type="number"
                      value={property.sizeSqFt || ""}
                      onChange={(e) => {
                        const sqFt = parseInt(e.target.value) || 0;
                        setProperty({ ...property, sizeSqFt: sqFt, sizeSqM: Math.round(sqFt * 0.0929) });
                      }}
                      placeholder="e.g., 1163"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sizeSqM" data-testid="label-size-sqm">Size (sq m)</Label>
                    <Input
                      id="sizeSqM"
                      data-testid="input-size-sqm"
                      type="number"
                      value={property.sizeSqM || ""}
                      onChange={(e) => {
                        const sqM = parseInt(e.target.value) || 0;
                        setProperty({ ...property, sizeSqM: sqM, sizeSqFt: Math.round(sqM / 0.0929) });
                      }}
                      placeholder="e.g., 108"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label data-testid="label-available-from">Available From *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !property.availableFrom && "text-muted-foreground"
                        )}
                        data-testid="button-available-from"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {property.availableFrom ? format(property.availableFrom, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={property.availableFrom}
                        onSelect={(date) => setProperty({ ...property, availableFrom: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rentPcm" data-testid="label-rent-pcm">Rent PCM *</Label>
                    <Input
                      id="rentPcm"
                      data-testid="input-rent-pcm"
                      type="number"
                      value={property.rentPcm || ""}
                      onChange={(e) => {
                        const pcm = parseInt(e.target.value) || 0;
                        setProperty({ ...property, rentPcm: pcm, rentPw: Math.round(pcm / 4.33) });
                      }}
                      placeholder="2910"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rentPw" data-testid="label-rent-pw">Rent PW</Label>
                    <Input
                      id="rentPw"
                      data-testid="input-rent-pw"
                      type="number"
                      value={property.rentPw || ""}
                      readOnly
                      className="bg-muted"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deposit" data-testid="label-deposit">Deposit *</Label>
                    <Input
                      id="deposit"
                      data-testid="input-deposit"
                      type="number"
                      value={property.deposit || ""}
                      onChange={(e) => setProperty({ ...property, deposit: parseInt(e.target.value) || 0 })}
                      placeholder="3357"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="councilTaxBand" data-testid="label-council-tax">Council Tax Band</Label>
                    <Select
                      value={property.councilTaxBand}
                      onValueChange={(value) => setProperty({ ...property, councilTaxBand: value })}
                    >
                      <SelectTrigger data-testid="select-council-tax">
                        <SelectValue placeholder="Select band" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A", "B", "C", "D", "E", "F", "G", "H"].map((band) => (
                          <SelectItem key={band} value={band}>{band}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="epcRating" data-testid="label-epc">EPC Rating</Label>
                    <Select
                      value={property.epcRating}
                      onValueChange={(value) => setProperty({ ...property, epcRating: value })}
                    >
                      <SelectTrigger data-testid="select-epc">
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A", "B", "C", "D", "E", "F", "G"].map((rating) => (
                          <SelectItem key={rating} value={rating}>{rating}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label data-testid="label-amenities">Amenities</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-4 border rounded-md">
                    {amenityOptions.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity}
                          data-testid={`checkbox-amenity-${amenity.replace(/\s+/g, "-")}`}
                          checked={property.amenities.includes(amenity)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setProperty({ ...property, amenities: [...property.amenities, amenity] });
                            } else {
                              setProperty({ ...property, amenities: property.amenities.filter((a) => a !== amenity) });
                            }
                          }}
                        />
                        <label htmlFor={amenity} className="text-sm cursor-pointer">
                          {amenity}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tenancyInfo" data-testid="label-tenancy-info">Tenancy Info & Incentives</Label>
                  <Textarea
                    id="tenancyInfo"
                    data-testid="textarea-tenancy-info"
                    value={property.tenancyInfo}
                    onChange={(e) => setProperty({ ...property, tenancyInfo: e.target.value })}
                    placeholder="Company Lets Accepted; Rental incentives available..."
                    rows={3}
                  />
                </div>
              </div>
            )}

            {/* Step 3: Requirements */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <Label data-testid="label-income-multiple">Income Multiple: {requirements.incomeMultiple.toFixed(1)}×</Label>
                  <Slider
                    data-testid="slider-income-multiple"
                    min={2.0}
                    max={4.0}
                    step={0.1}
                    value={[requirements.incomeMultiple]}
                    onValueChange={([value]) => setRequirements({ ...requirements, incomeMultiple: value })}
                  />
                  <p className="text-sm text-muted-foreground">
                    Tenant's annual income must be at least {requirements.incomeMultiple}× the annual rent
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="minTermMonths" data-testid="label-min-term">Minimum Term (Months)</Label>
                  <Input
                    id="minTermMonths"
                    data-testid="input-min-term"
                    type="number"
                    min="1"
                    value={requirements.minTermMonths}
                    onChange={(e) => setRequirements({ ...requirements, minTermMonths: parseInt(e.target.value) || 12 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxOccupants" data-testid="label-max-occupants">Maximum Occupants</Label>
                  <Input
                    id="maxOccupants"
                    data-testid="input-max-occupants"
                    type="number"
                    min="1"
                    value={requirements.maxOccupants}
                    onChange={(e) => setRequirements({ ...requirements, maxOccupants: parseInt(e.target.value) || 2 })}
                  />
                </div>

                <div className="space-y-3">
                  <Label data-testid="label-policies">Policies</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="guarantorRequired"
                        data-testid="checkbox-guarantor"
                        checked={requirements.guarantorRequired}
                        onCheckedChange={(checked) => setRequirements({ ...requirements, guarantorRequired: !!checked })}
                      />
                      <label htmlFor="guarantorRequired" className="text-sm cursor-pointer">
                        Guarantor Required
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="petsAllowed"
                        data-testid="checkbox-pets-allowed"
                        checked={requirements.petsAllowed}
                        onCheckedChange={(checked) => setRequirements({ ...requirements, petsAllowed: !!checked })}
                      />
                      <label htmlFor="petsAllowed" className="text-sm cursor-pointer">
                        Pets Allowed
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="studentsOk"
                        data-testid="checkbox-students"
                        checked={requirements.studentsOk}
                        onCheckedChange={(checked) => setRequirements({ ...requirements, studentsOk: !!checked })}
                      />
                      <label htmlFor="studentsOk" className="text-sm cursor-pointer">
                        Students Accepted
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="smokingAllowed"
                        data-testid="checkbox-smoking"
                        checked={requirements.smokingAllowed}
                        onCheckedChange={(checked) => setRequirements({ ...requirements, smokingAllowed: !!checked })}
                      />
                      <label htmlFor="smokingAllowed" className="text-sm cursor-pointer">
                        Smoking Allowed
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label data-testid="label-docs-required">Documents Required from Tenant</Label>
                  <div className="space-y-2">
                    {docsOptions.map(({ value, label }) => (
                      <div key={value} className="flex items-center space-x-2">
                        <Checkbox
                          id={value}
                          data-testid={`checkbox-doc-${value}`}
                          checked={requirements.docsRequired.includes(value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setRequirements({ ...requirements, docsRequired: [...requirements.docsRequired, value] });
                            } else {
                              setRequirements({ ...requirements, docsRequired: requirements.docsRequired.filter((d) => d !== value) });
                            }
                          }}
                        />
                        <label htmlFor={value} className="text-sm cursor-pointer">
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Red Flags & Viewings */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label data-testid="label-red-flags">Tenant Red Flags (Disqualifiers)</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="disallowAdverseCredit"
                        data-testid="checkbox-adverse-credit"
                        checked={redFlags.disallowAdverseCredit}
                        onCheckedChange={(checked) => setRedFlags({ ...redFlags, disallowAdverseCredit: !!checked })}
                      />
                      <label htmlFor="disallowAdverseCredit" className="text-sm cursor-pointer">
                        Disallow Adverse Credit
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="disallowCCJs"
                        data-testid="checkbox-ccjs"
                        checked={redFlags.disallowCCJs}
                        onCheckedChange={(checked) => setRedFlags({ ...redFlags, disallowCCJs: !!checked })}
                      />
                      <label htmlFor="disallowCCJs" className="text-sm cursor-pointer">
                        Disallow CCJs (County Court Judgments)
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="disallowArrearsHistory"
                        data-testid="checkbox-arrears"
                        checked={redFlags.disallowArrearsHistory}
                        onCheckedChange={(checked) => setRedFlags({ ...redFlags, disallowArrearsHistory: !!checked })}
                      />
                      <label htmlFor="disallowArrearsHistory" className="text-sm cursor-pointer">
                        Disallow Arrears History
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="evictionsHistoryDisallowed"
                        data-testid="checkbox-evictions"
                        checked={redFlags.evictionsHistoryDisallowed}
                        onCheckedChange={(checked) => setRedFlags({ ...redFlags, evictionsHistoryDisallowed: !!checked })}
                      />
                      <label htmlFor="evictionsHistoryDisallowed" className="text-sm cursor-pointer">
                        Disallow Eviction History
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hmoRestrictions" data-testid="label-hmo">HMO / Local Constraints</Label>
                  <Textarea
                    id="hmoRestrictions"
                    data-testid="textarea-hmo"
                    value={redFlags.hmoRestrictions}
                    onChange={(e) => setRedFlags({ ...redFlags, hmoRestrictions: e.target.value })}
                    placeholder="e.g., Max 4 unrelated occupants due to local HMO licence"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="otherNotes" data-testid="label-other-notes">Other Notes</Label>
                  <Textarea
                    id="otherNotes"
                    data-testid="textarea-other-notes"
                    value={redFlags.otherNotes}
                    onChange={(e) => setRedFlags({ ...redFlags, otherNotes: e.target.value })}
                    placeholder="Images are from show apartment; illustrative only."
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label data-testid="label-viewing-slots">Viewing Slots (Optional)</Label>
                  <p className="text-sm text-muted-foreground">Add viewing slots after publishing from your dashboard</p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0}
                data-testid="button-back"
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>

              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                data-testid="button-next"
              >
                {currentStep === steps.length - 1 ? "Publish Property" : "Next"}
                {currentStep < steps.length - 1 && <ChevronRight className="ml-2 h-4 w-4" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
