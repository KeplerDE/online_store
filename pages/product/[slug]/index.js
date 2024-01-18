import { useRouter } from 'next/router';

export default function ProductViewPage() {
  const router = useRouter();
  const { slug } = router.query; // Извлекаем 'slug' напрямую из query объекта

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-lg-8 offset-lg-2">
          <h1 className="text-center">{slug}</h1> 
        </div>
      </div>
    </div>
  );
}

  