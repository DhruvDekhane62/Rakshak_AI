import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card/50 border-destructive/20 border">
        <CardContent className="pt-6 flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-16 w-16 text-destructive mb-4" />
          <h1 className="text-2xl font-bold font-mono text-foreground mb-2">
            404: RESOURCE NOT FOUND
          </h1>
          <p className="text-sm text-muted-foreground font-mono mb-6">
            The requested intelligence asset could not be located in the database. 
            Ensure you have the correct clearance level and the URL is correct.
          </p>
          <Link href="/dashboard">
            <Button variant="outline" className="font-mono text-xs uppercase tracking-widest border-primary/50 text-primary">
              Return to Command Center
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
