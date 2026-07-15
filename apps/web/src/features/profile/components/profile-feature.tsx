import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageDescription, PageHeader, PageTitle } from "@/components/ds/page";
import { ProfileForm } from "@/features/profile/forms/profile-form";

export function ProfileFeature() {
  return (
    <>
      <PageHeader>
        <PageTitle>Perfil</PageTitle>
        <PageDescription>
          Dados base compartilhados entre portfolio publico e curriculos.
        </PageDescription>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Informacoes principais</CardTitle>
          <CardDescription>
            Mantenha estes dados neutros o suficiente para reaproveitar em diferentes versoes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
    </>
  );
}
