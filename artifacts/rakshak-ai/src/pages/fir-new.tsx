import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCreateFir } from '@workspace/api-client-react';
import { FileText, ChevronLeft, ShieldAlert, Terminal, CheckCircle } from 'lucide-react';

const DISTRICT_MAPPING: Record<string, { code: string; name: string }> = {
  "Koramangala PS": { code: "0443", name: "Bengaluru Urban" },
  "Indiranagar PS": { code: "0443", name: "Bengaluru Urban" },
  "Mysuru Town PS": { code: "0444", name: "Mysuru" },
  "Hubballi PS": { code: "0445", name: "Dharwad" },
  "Kalaburagi Central PS": { code: "0446", name: "Kalaburagi" },
  "Shivamogga PS": { code: "0447", name: "Shivamogga" },
};

const STATION_MAPPING: Record<string, string> = {
  "Koramangala PS": "0006",
  "Indiranagar PS": "0007",
  "Mysuru Town PS": "0008",
  "Hubballi PS": "0009",
  "Kalaburagi Central PS": "0010",
  "Shivamogga PS": "0011",
};

export default function AddFir() {
  const [, setLocation] = useLocation();
  const userRole = localStorage.getItem('user_role') || 'investigator';
  const currentOfficer = localStorage.getItem('officer_id') || 'KSP-8492';

  // State
  const [station, setStation] = useState('Koramangala PS');
  const [serial, setSerial] = useState('00008');
  const [crimeType, setCrimeType] = useState('Burglary');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [locationName, setLocationName] = useState('Koramangala 3rd Block');
  const [description, setDescription] = useState('');
  const [officerName, setOfficerName] = useState('O.P. Singh');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Auto-calculated CrimeNo and CaseNo formulas (matches Police_FIR_ER_Diagram.md specifications)
  const [crimeNo, setCrimeNo] = useState('');
  const [caseNo, setCaseNo] = useState('');

  const { mutate: createFir, isPending } = useCreateFir({
    mutation: {
      onSuccess: () => {
        setSuccess(true);
        setTimeout(() => {
          setLocation('/firs');
        }, 1500);
      },
      onError: (err: any) => {
        setError(`Filing failed: ${err?.response?.data?.error || err.message}`);
      }
    }
  });

  useEffect(() => {
    const categoryCode = "1"; // FIR code
    const districtInfo = DISTRICT_MAPPING[station] || { code: "0443", name: "Bengaluru Urban" };
    const stationCode = STATION_MAPPING[station] || "0006";
    const yearStr = "2026";
    const serialStr = serial.padStart(5, '0');

    setCrimeNo(`${categoryCode}${districtInfo.code}${stationCode}${yearStr}${serialStr}`);
    setCaseNo(`${yearStr}${serialStr}`);
  }, [station, serial]);

  // Auth Guard: Only Investigator can view/file FIRs
  if (userRole !== 'investigator') {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="h-16 w-16 bg-destructive/10 border border-destructive/30 rounded-2xl flex items-center justify-center shadow-[0_0_35px_rgba(239,68,68,0.2)]">
          <ShieldAlert className="h-8 w-8 text-destructive animate-bounce" />
        </div>
        <h2 className="text-2xl font-bold font-mono tracking-tight text-destructive">UNAUTHORIZED ACCESS</h2>
        <p className="text-muted-foreground font-mono text-sm max-w-md uppercase tracking-wider">
          Filing New First Information Reports (FIRs) is restricted to Officers holding INVESTIGATOR clearance levels.
        </p>
        <Link href="/firs">
          <Button variant="outline" className="font-mono text-xs uppercase mt-4">
            Back to Database
          </Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!description.trim()) {
      setError('Brief facts description is required.');
      return;
    }

    const districtName = DISTRICT_MAPPING[station]?.name || "Bengaluru Urban";

    createFir({
      data: {
        firNumber: crimeNo,
        crimeType,
        district: districtName,
        policeStation: station,
        dateOfOccurrence: new Date(date).toISOString(),
        location: locationName,
        description,
        officerInCharge: officerName,
        latitude: 12.9716,
        longitude: 77.5946,
      }
    });
  };

  return (
    <div className="p-6 space-y-6 max-w-[1000px] mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/firs">
          <Button variant="outline" size="icon" className="h-8 w-8 shrink-0">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold font-mono tracking-tight flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            FILE FIRST INFORMATION REPORT (FIR)
          </h1>
          <p className="text-muted-foreground font-mono text-xs mt-1 uppercase tracking-widest">
            Filing Session: Officer {currentOfficer}
          </p>
        </div>
      </div>

      <Card className="border-border bg-card/50 backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
        <CardHeader>
          <CardTitle className="font-mono text-sm uppercase">FIR Formulation Form</CardTitle>
          <CardDescription>All fields are compliant with the Karnataka Police ER Diagram standards.</CardDescription>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-emerald-500 animate-pulse" />
              <h3 className="text-xl font-bold font-mono text-emerald-500">FIR RECORDED SUCCESSFULLY</h3>
              <p className="text-muted-foreground font-mono text-xs uppercase tracking-wider">
                Crime Number {crimeNo} saved to Central Archive. Redirecting...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-xs font-mono">
                  {error}
                </div>
              )}

              {/* CrimeNo Live Formula Box */}
              <div className="p-4 bg-secondary/30 border border-border rounded-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <span className="text-[10px] font-mono text-primary font-bold uppercase tracking-wider block">Auto-Computed Crime Number (CrimeNo)</span>
                  <span className="text-2xl font-bold font-mono tracking-wider text-foreground">{crimeNo}</span>
                </div>
                <div className="text-left md:text-right">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">Case Number (CaseNo)</span>
                  <span className="text-lg font-bold font-mono text-foreground">{caseNo}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Police Station (Unit)</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono bg-card"
                    value={station}
                    onChange={(e) => setStation(e.target.value)}
                  >
                    {Object.keys(DISTRICT_MAPPING).map(s => (
                      <option key={s} value={s}>{s} ({DISTRICT_MAPPING[s].name})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Running Serial (5-Digits)</label>
                  <Input 
                    type="text" 
                    className="font-mono"
                    value={serial}
                    onChange={(e) => setSerial(e.target.value.replace(/\D/g, '').substring(0, 5))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Major Crime Head</label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono bg-card"
                    value={crimeType}
                    onChange={(e) => setCrimeType(e.target.value)}
                  >
                    {['Burglary', 'Cybercrime', 'Murder', 'Robbery', 'Vehicle Theft', 'Assault'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Date of Occurrence</label>
                  <Input 
                    type="date" 
                    className="font-mono"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Specific Location Details</label>
                  <Input 
                    placeholder="e.g. Koramangala 3rd Block" 
                    className="font-mono"
                    value={locationName}
                    onChange={(e) => setLocationName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Officer In Charge (IO)</label>
                  <Input 
                    className="font-mono"
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Brief Facts of Case (Description)</label>
                <Textarea 
                  placeholder="Summarize incident timeline, property stolen, or details of assault..." 
                  className="font-mono min-h-[120px]"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="pt-4 border-t flex gap-3 justify-end">
                <Link href="/firs">
                  <Button type="button" variant="outline" className="font-mono text-xs uppercase">Cancel</Button>
                </Link>
                <Button 
                  type="submit" 
                  disabled={isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold uppercase tracking-wider text-xs px-6"
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <Terminal className="h-4 w-4 animate-pulse" />
                      <span>Filing FIR...</span>
                    </div>
                  ) : 'File Report'}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
