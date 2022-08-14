import { CheckIcon, XIcon } from "@heroicons/react/outline";

export enum IconEnum {
  check,
  cross,
}

type BulletType = {
  title: string;
  icon: IconEnum;
  description: string;
};

const Bullet = ({ title, icon, description }: BulletType) => {
  return (
    <div>
      <dt className="flex items-center">
        {icon === IconEnum.check ? (
          <div className="mr-4 rounded-full bg-green-100 p-2 text-green-700">
            <CheckIcon className="h-6 w-6" />
          </div>
        ) : (
          <div className="mr-4 rounded-full bg-red-100 p-2 text-red-700">
            <XIcon className="h-6 w-6" />
          </div>
        )}
        <h3 className="font-medium leading-6 text-gray-900">{title}</h3>
      </dt>
      <dd className="mt-2 text-sm text-gray-500">{description}</dd>
    </div>
  );
};

export default Bullet;
