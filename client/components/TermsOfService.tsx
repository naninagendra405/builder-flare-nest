import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  FileText,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  Scale,
  Gavel,
  CreditCard,
  Users,
} from "lucide-react";

interface TermsOfServiceProps {
  onAccept?: () => void;
  showAcceptance?: boolean;
  compact?: boolean;
}

export default function TermsOfService({
  onAccept,
  showAcceptance = false,
  compact = false,
}: TermsOfServiceProps) {
  const [hasAccepted, setHasAccepted] = useState(false);
  const [showFullTerms, setShowFullTerms] = useState(false);

  const handleAccept = () => {
    setHasAccepted(true);
    onAccept?.();
  };

  const compactView = (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Terms & Policies</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
              <div>
                <h4 className="font-medium text-sm">Secure Payments</h4>
                <p className="text-xs text-muted-foreground">
                  Escrow protection for all transactions
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Clock className="w-5 h-5 text-green-600" />
              <div>
                <h4 className="font-medium text-sm">Auto-Release</h4>
                <p className="text-xs text-muted-foreground">
                  Payment auto-releases after 7 days
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Scale className="w-5 h-5 text-purple-600" />
              <div>
                <h4 className="font-medium text-sm">Dispute Resolution</h4>
                <p className="text-xs text-muted-foreground">
                  Fair mediation for all disputes
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 border rounded-lg">
              <Users className="w-5 h-5 text-orange-600" />
              <div>
                <h4 className="font-medium text-sm">Verified Users</h4>
                <p className="text-xs text-muted-foreground">
                  Identity verification required
                </p>
              </div>
            </div>
          </div>

          <Dialog open={showFullTerms} onOpenChange={setShowFullTerms}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <FileText className="w-4 h-4 mr-2" />
                View Full Terms & Conditions
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Terms of Service & Policies</DialogTitle>
              </DialogHeader>
              <div className="prose prose-sm max-w-none">
                <FullTermsContent />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );

  const fullView = (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="w-5 h-5" />
          <span>Terms of Service</span>
          <Badge variant="outline">Updated Dec 2024</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <FullTermsContent />
        </div>

        {showAcceptance && (
          <div className="mt-8 p-4 border rounded-lg bg-muted/50">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="accept-terms"
                checked={hasAccepted}
                onCheckedChange={(checked) =>
                  setHasAccepted(checked as boolean)
                }
              />
              <div className="flex-1">
                <Label
                  htmlFor="accept-terms"
                  className="text-sm font-medium cursor-pointer"
                >
                  I have read and agree to the Terms of Service
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  By checking this box, you agree to all terms, policies, and
                  procedures outlined above.
                </p>
              </div>
            </div>

            <Button
              onClick={handleAccept}
              disabled={!hasAccepted}
              className="w-full mt-4"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Accept Terms & Continue
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return compact ? compactView : fullView;
}

function FullTermsContent() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">TaskIt Terms of Service</h1>
        <p className="text-muted-foreground">
          Last updated: December 2024 ��� Effective immediately
        </p>
      </div>

      <Accordion type="multiple" className="w-full">
        <AccordionItem value="payment-terms">
          <AccordionTrigger className="text-left">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Payment Terms & Escrow System</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                All payments are held in secure escrow until task completion for
                maximum protection.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <h4 className="font-semibold">Escrow Protection</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  Customer funds are held securely when a task is approved
                </li>
                <li>
                  Payment is only released when both parties confirm completion
                </li>
                <li>Taskers cannot access funds until work is verified</li>
                <li>Platform fee (10%) is deducted before release to tasker</li>
              </ul>

              <h4 className="font-semibold">Auto-Release Policy</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>
                  If customer doesn't respond within 7 days of task completion,
                  payment is automatically released
                </li>
                <li>
                  Auto-release only occurs after both parties mark task as
                  complete
                </li>
                <li>
                  Customers receive email notifications before auto-release
                </li>
                <li>Disputes must be raised before auto-release occurs</li>
              </ul>

              <h4 className="font-semibold">Milestone Payments</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Large tasks can be broken into milestone payments</li>
                <li>
                  Each milestone requires customer approval before payment
                </li>
                <li>Milestone funds are held separately in escrow</li>
                <li>Individual milestones can be disputed independently</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="dispute-resolution">
          <AccordionTrigger className="text-left">
            <div className="flex items-center space-x-2">
              <Gavel className="w-4 h-4" />
              <span>Dispute Resolution Process</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <Alert>
              <Scale className="h-4 w-4" />
              <AlertDescription>
                Fair mediation process ensures disputes are resolved quickly and
                equitably.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <h4 className="font-semibold">Dispute Timeline</h4>
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Task Completion</span>
                  <span className="text-xs text-muted-foreground">Day 0</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Customer Review Period</span>
                  <span className="text-xs text-muted-foreground">
                    Days 1-7
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Auto-Release (if no disputes)</span>
                  <span className="text-xs text-muted-foreground">Day 7</span>
                </div>
              </div>

              <h4 className="font-semibold">Dispute Process</h4>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                <li>Either party can raise a dispute within 7 days</li>
                <li>Evidence submission period (3 days)</li>
                <li>Platform mediation review (2-5 business days)</li>
                <li>Final decision and fund release</li>
              </ol>

              <h4 className="font-semibold">Evidence Requirements</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Photos/videos of completed work</li>
                <li>Communication records</li>
                <li>Original task requirements</li>
                <li>Any additional documentation</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="verification">
          <AccordionTrigger className="text-left">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>User Verification Requirements</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Verification ensures a safe and trustworthy platform for all
                users.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <h4 className="font-semibold">Required Verifications</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Email address verification</li>
                <li>Phone number verification</li>
                <li>Government-issued ID verification</li>
                <li>Payment method verification</li>
              </ul>

              <h4 className="font-semibold">
                Additional Verifications (Taskers)
              </h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Background check completion</li>
                <li>Professional certification (where applicable)</li>
                <li>Insurance verification (for certain categories)</li>
                <li>Business license (for commercial taskers)</li>
              </ul>

              <h4 className="font-semibold">Verification Benefits</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Higher task limits</li>
                <li>Premium badge display</li>
                <li>Increased trust rating</li>
                <li>Priority in search results</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="safety-guidelines">
          <AccordionTrigger className="text-left">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Safety & Security Guidelines</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Platform Safety</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>All communication through platform messaging</li>
                <li>Work proof documentation required</li>
                <li>Ratings and reviews for accountability</li>
                <li>24/7 customer support for issues</li>
              </ul>

              <h4 className="font-semibold">Personal Safety</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Meet in public places for in-person tasks</li>
                <li>Verify tasker identity before allowing home access</li>
                <li>Report suspicious behavior immediately</li>
                <li>Keep platform informed of any safety concerns</li>
              </ul>

              <h4 className="font-semibold">Data Protection</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Personal information encrypted and secured</li>
                <li>Payment data handled by certified processors</li>
                <li>GDPR compliant data handling</li>
                <li>Right to data deletion upon request</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="platform-fees">
          <AccordionTrigger className="text-left">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Platform Fees & Charges</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-semibold">Customer Fees</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>No fees to post tasks or browse taskers</li>
                <li>No fees for messaging or negotiations</li>
                <li>Payment processing fees may apply (card provider fees)</li>
              </ul>

              <h4 className="font-semibold">Tasker Fees</h4>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>10% service fee on completed tasks</li>
                <li>No fees to bid on tasks</li>
                <li>Express withdrawal fees for fast transfers</li>
              </ul>

              <h4 className="font-semibold">Fee Structure</h4>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-medium mb-2">Example: ₹1000 Task</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Customer pays:</span>
                    <span>₹1000</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform fee (10%):</span>
                    <span>₹100</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Tasker receives:</span>
                    <span>₹900</span>
                  </div>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          These terms are binding and enforceable. By using TaskIt, you agree to
          comply with all policies and procedures outlined above. Terms may be
          updated periodically with notice to users.
        </AlertDescription>
      </Alert>

      <div className="text-sm text-muted-foreground">
        <p>
          For questions about these terms or to report violations, contact our
          support team at support@taskit.com
        </p>
        <p className="mt-2">
          © 2024 TaskIt. All rights reserved. Terms subject to local laws and
          regulations.
        </p>
      </div>
    </div>
  );
}
