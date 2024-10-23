export default function BanksTestcomponent({title, description}: {title:string, description:string}) {
	return <div className="flex flex-col">
      <span>{title}</span>
        <span>{description}</span>
    </div>;
}
