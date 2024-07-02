import { Card } from "../ui/card";

interface ProcessCardType {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
}

const ProcessCard = (props: ProcessCardType) => (
  <div onClick={props.onClick}>
    <Card className="p-4 border border-solid border-neutral-300 rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-md hover:border-primary ">
      <div className="mb-8">{props.icon}</div>
      <h2 className="font-medium text-sm">{props.title}</h2>
    </Card>
  </div>
);

export default ProcessCard;
