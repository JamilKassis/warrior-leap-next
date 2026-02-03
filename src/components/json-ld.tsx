interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[] | null;
}

export default function JsonLd({ data }: JsonLdProps) {
  if (!data) return null;

  const schemas = Array.isArray(data) ? data : [data];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
