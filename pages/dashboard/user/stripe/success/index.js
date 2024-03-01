import { useRouter } from 'next/router';

export default function UserStripeSuccess() {
  const router = useRouter();

  // Function to handle the click event
  const viewOrderStatus = () => {
    router.push('/dashboard/user/orders');
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col text-center">
          <p>
            Thank you for your purchase. You can now check your order
            status in the dashboard.
          </p>
          <hr />
          {/* Adding onClick event handler to the button */}
          <button className="btn btn-primary btn-raised" onClick={viewOrderStatus}>
            View Order Status
          </button>
        </div>
      </div>
    </div>
  );
}
