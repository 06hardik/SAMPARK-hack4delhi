import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Header } from '@/components/layout/Header';
import { StatusBadge } from '@/components/parking/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { parkingService } from '@/services/parkingService';
import { Violation, Evidence } from '@/types/parking';
import { format } from 'date-fns';
import { 
  ArrowLeft, Clock, Camera, MapPin, IndianRupee,
  FileText, Copy, Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} minutes`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours} hours`;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);
}

function EvidenceCard({ evidence }: { evidence: Evidence }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyHash = async () => {
    await navigator.clipboard.writeText(evidence.sha256Hash);
    setCopied(true);
    toast({ title: 'Hash copied to clipboard' });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="overflow-hidden">
      <div className="aspect-video bg-muted relative">
        <img src={evidence.imageUrl} alt="" className="w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Camera className="h-14 w-14 text-muted-foreground" />
        </div>
        <div className="absolute top-2 right-2 bg-white/90 rounded px-2.5 py-1 text-sm font-medium">
          {evidence.vehicleCount} vehicles
        </div>
      </div>

      <CardContent className="p-4 space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>{format(evidence.capturedAt, 'MMM d, yyyy HH:mm:ss')}</span>
          <span className="text-muted-foreground">{evidence.metadata.cameraId}</span>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          Section {evidence.metadata.lotSection}
        </div>

        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs bg-muted p-1.5 rounded truncate">
            {evidence.sha256Hash.substring(0, 24)}...
          </code>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyHash}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ViolationDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [violation, setViolation] = useState<Violation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchViolation = async () => {
      setIsLoading(true);
      const data = await parkingService.getViolation(id);
      setViolation(data);
      setIsLoading(false);
    };
    fetchViolation();
    const interval = setInterval(fetchViolation, 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <Header title="Violation Details" />
        <div className="p-5 space-y-5">
          <Skeleton className="h-10 w-56" />
          <div className="grid md:grid-cols-2 gap-5">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </div>
          <Skeleton className="h-96" />
        </div>
      </DashboardLayout>
    );
  }

  if (!violation) {
    return (
      <DashboardLayout>
        <Header title="Violation Not Found" />
        <div className="p-6 text-center space-y-2">
          <FileText className="h-14 w-14 mx-auto text-muted-foreground/40" />
          <p className="text-base text-muted-foreground">The violation you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/violations')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Violations
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const isActive = violation.status === 'active';
  const currentDuration = isActive
    ? Math.floor((Date.now() - violation.startedAt.getTime()) / 60000)
    : violation.durationMinutes;

  return (
    <DashboardLayout>
      <Header
        title={violation.lotName}
        subtitle="MCD Operated Parking"
        actions={
          <Button variant="outline" onClick={() => navigate('/violations')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        }
      />

      <div className="p-6 space-y-5">

        <div className={cn(
          'rounded border p-4 flex flex-col sm:flex-row justify-between gap-3',
          isActive ? 'bg-status-violating/5 border-status-violating/30' : 'bg-muted'
        )}>
          <div className="flex items-center gap-3">
            <StatusBadge status={isActive ? 'violating' : 'compliant'} showPulse={isActive} size="md" />
            <span className="text-base">
              {isActive ? 'This violation is currently active' : 'This violation has been resolved'}
            </span>
          </div>
          <span className="text-sm text-muted-foreground">ID: {violation.id}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5" /> Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-base">
              <div>
                <p className="font-medium">Violation Started</p>
                <p className="text-muted-foreground">{format(violation.startedAt, 'MMM d, yyyy HH:mm:ss')}</p>
              </div>
              <div>
                <p className="font-medium">Peak Excess</p>
                <p className="text-muted-foreground">{violation.peakCount} vehicles (+{violation.maxExcess})</p>
              </div>
              <div>
                <p className="font-medium">{isActive ? 'Ongoing' : 'Violation Ended'}</p>
                <p className="text-muted-foreground">
                  {isActive ? formatDuration(currentDuration) : violation.endedAt && format(violation.endedAt, 'MMM d, yyyy HH:mm:ss')}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <IndianRupee className="h-5 w-5" /> Penalty Calculation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-base">
              <div className="space-y-1">
                <div className="flex justify-between"><span>Allowed Capacity</span><span>{violation.allowedCapacity}</span></div>
                <div className="flex justify-between"><span>Peak Count</span><span>{violation.peakCount}</span></div>
                <div className="flex justify-between"><span>Maximum Excess</span><span>{violation.maxExcess}</span></div>
                <div className="flex justify-between"><span>Duration</span><span>{formatDuration(currentDuration)}</span></div>
              </div>
              {!isActive && (
                <div className="text-xl font-bold">{formatCurrency(violation.penaltyAmount)}</div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Camera className="h-5 w-5" /> Evidence ({violation.evidence.length})
          </h2>

          {violation.evidence.length === 0 ? (
            <Card className="p-6 text-center text-muted-foreground">No evidence captured yet</Card>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {violation.evidence.map(ev => (
                <EvidenceCard key={ev.id} evidence={ev} />
              ))}
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
