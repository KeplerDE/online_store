import React, { useEffect } from 'react';
import { useTag } from '@/context/tag';
import TagCreate from '@/components/tag/TagCreate';

export default function Tags() {
  // Использование контекста для работы с тегами
  const { fetchTags } = useTag();

  // Вызов fetchTags при монтировании компонента
  useEffect(() => {
    fetchTags();
  }, []); // Пустой массив зависимостей означает, что эффект выполнится один раз после первого рендеринга

  // Рендеринг компонента
  return (
    <div className="container mb-5">
      <div className="row">
        <div className="col">
          <p className="lead">Create Tags</p>
          <TagCreate />
        </div>
      </div>
      <div className="row mt-5">
        <div className="col">
          <p className="lead mb-4">List of Tags</p>
        </div>
      </div>
    </div>
  );
}
