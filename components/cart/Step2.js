export default function Step2({ onPrevStep, onNextStep }) {
    return (
      <div>
        <p>Contact details</p>
        <button onClick={onPrevStep}>Previous</button>
        <button onClick={onNextStep}>Next</button>
      </div>
    );
  }
  