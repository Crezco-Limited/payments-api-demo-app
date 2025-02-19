import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VerifyOrgStepProps {
  onNext: (data?: any) => void;
  onBack: () => void;
}

export function VerifyOrgStep({ onNext, onBack }: VerifyOrgStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Verify Your Organisation</CardTitle>
        <CardDescription>
          Provide additional information to verify your organisation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onNext();
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="taxId">Tax ID</Label>
            <Input id="taxId" placeholder="Enter your tax ID" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="businessLicense">Business License Number</Label>
            <Input
              id="businessLicense"
              placeholder="Enter your business license number"
              required
            />
          </div>
          <div className="flex justify-between">
            <Button onClick={onBack} variant="outline" type="button">
              Back
            </Button>
            <Button type="submit">Next</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
