import React, { useEffect, useState } from "react";
import {
  Banner,
  useApi,
  useTranslate,
  reactExtension,
  DatePicker,
  Heading,
  useCartLines,
  useApplyMetafieldsChange,
  useMetafield,
} from "@shopify/ui-extensions-react/checkout";

// Set the entry point for the extension
export default reactExtension("purchase.checkout.block.render", () => (
  <Extension />
));

function Extension() {
  const translate = useTranslate();
  const { extension } = useApi();
  const cartLines = useCartLines();
  const [hasRentalProduct, setHasRentalProduct] = useState(false);
  const setRentalDate = useApplyMetafieldsChange();
  const rentalDate = useMetafield({
    namespace: "custom",
    key: "pickup_date",
  });

  useEffect(() => {
    // Debug: Log the current state of the rentalDate metafield
    console.log("Rental Date Metafield:", rentalDate);
  }, [rentalDate]);

  useEffect(() => {
    const checkForRentalProducts = () => {
      const rentalProducts = cartLines.some(
        (line) => line.merchandise.product.productType === "rental",
      );

      setHasRentalProduct(rentalProducts);
    };

    checkForRentalProducts();
  }, [cartLines]);

  if (!hasRentalProduct) {
    return null; // Don't render anything if no rental product is found
  }

  return (
    <>
      <Heading>Rental Pickup Date:</Heading>
      <DatePicker
        selected={rentalDate?.value}
        onChange={(value) => {
          setRentalDate({
            type: "updateMetafield",
            namespace: "custom",
            key: "pickup_date",
            valueType: "string",
            value,
          });
        }}
      />
    </>
  );
}
