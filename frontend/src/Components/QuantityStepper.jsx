function QuantityStepper({
  quantity = 1,
  min = 1,
  max = 20,
  onChange
}) {
  function updateQuantity(nextQuantity) {
    const next = Math.min(max, Math.max(min, nextQuantity));

    onChange?.(next);
  }

  return (
    <div className="quantity-stepper" aria-label="Book quantity">
      <button
        type="button"
        onClick={() => updateQuantity(quantity - 1)}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
      >
        −
      </button>

      <span aria-live="polite">{quantity}</span>

      <button
        type="button"
        onClick={() => updateQuantity(quantity + 1)}
        disabled={quantity >= max}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

export default QuantityStepper;