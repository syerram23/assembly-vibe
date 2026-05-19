import { PageHeader, Card, EmptyState } from "./ui";

interface Props {
  title: string;
  description: string;
  eyebrow: string;
  scheduledTurn: string;
}

export function ModuleStub({ title, description, eyebrow, scheduledTurn }: Props) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />
      <Card>
        <EmptyState
          title="This module is on the build sequence"
          description={`Implementing this module in ${scheduledTurn}. The data model is wired and the navigation is live — the screens land in the next build pass.`}
          cta={null}
        />
      </Card>
    </>
  );
}
