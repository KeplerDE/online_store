export default function Step1({ onNextStep }) {
    return (
      <div>
        <p>Review cart</p>
        <button onClick={onNextStep}>Next</button>
      </div>
    );
  }
  