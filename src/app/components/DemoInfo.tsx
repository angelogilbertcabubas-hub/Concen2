import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

export default function DemoInfo() {
  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Badge className="bg-primary text-primary-foreground">DEMO MODE</Badge>
          <CardTitle className="text-base">Interactive Prototype</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="text-sm space-y-2">
        <p className="text-muted-foreground">
          This is a fully interactive prototype. Switch between roles using the header dropdown to see different dashboards:
        </p>
        <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
          <li><strong>Team Leader:</strong> Clairo F. Webster - Management view with KPIs and approvals</li>
          <li><strong>CSR:</strong> Hailey Swift - Customer support tickets and personal metrics</li>
          <li><strong>Tech Support:</strong> Jeff Hozier - System diagnostics and bug tracking</li>
        </ul>
      </CardContent>
    </Card>
  );
}
