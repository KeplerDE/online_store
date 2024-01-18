import { useRouter } from "next/router";

export default function Pagination({ currentPage, totalPages, pathname }) {
  const router = useRouter();

  const handlePageClick = (page) => {
    router.push(`${pathname}?page=${page}`);
  };

  return (
    <div className="row">
      <div className="col">
        <nav className="d-flex justify-content-center">
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              return (
                <li
                  key={page}
                  className={`page-item ${
                    currentPage === page ? " active" : ""
                  }`}
                >
                  <button
                    className="page-link"
                    onClick={() => handlePageClick(page)}
                  >
                    {page}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
