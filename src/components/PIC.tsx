export default function PIC({ data }: { data: any }) {
  return (
    <div className="border rounded shadow p-2">
      <img
        src={data.url}
        alt={data.titel}
        className="w-full h-auto"
        loading="lazy"
      />
      <p className="mt-2 text-sm">{data.titel}</p>
    </div>
  )
}