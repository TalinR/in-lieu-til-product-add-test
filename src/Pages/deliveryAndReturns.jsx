import React from "react";
import styles from "../Styles/deliveryAndReturns.module.css"; // Import the CSS module

const DeliveryAndReturns = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Exchange policy</h2>
      <p className={styles.paragraph}>
        We will allow for exchange of items where the items are in saleable condition, in their original packaging with tags attached. The goods must not be worn, damaged or washed. Please notify us at <a href="mailto:info@inlieuofficial.com" className={styles.link}>info@inlieuofficial.com</a> within 7 days of receipt of goods and provide us with the original invoice as proof of purchase. You may exchange your garment for any item of your choice (subject to availability).
      </p>
      <p className={styles.paragraph}>
        Aside from faulty items, shipping costs for exchange of goods are to be covered by the customer.
      </p>

      <h2 className={styles.heading}>Returns policy</h2>
      <p className={styles.paragraph}>
        A full refund will be provided for the return of full-priced items so long as they are in saleable condition, in their original packaging with tags attached. The goods must not be worn, damaged or washed. Please notify us at <a href="mailto:info@inlieuofficial.com" className={styles.link}>info@inlieuofficial.com</a> within 7 days of receipt of goods and provide us with the original invoice as proof of purchase.
      </p>
      <p className={styles.paragraph}>
        Refunds will be made to the original purchaser’s credit card.
      </p>
      <p className={styles.paragraph}>
        Aside from faulty items, shipping costs for the return of goods are to be covered by the customer.
      </p>

      <h2 className={styles.heading}>Domestic deliveries</h2>
      <p className={styles.paragraph}>
        Deliveries within Australia will arrive within 3-7 business days after you have received your dispatch confirmation email. Domestic deliveries will be shipped via Australia Post Standard Shipping.
      </p>
      <p className={styles.paragraph}>
        Once we have dispatched your order, you will receive a dispatch confirmation e-mail including tracking details for your parcel.
      </p>
      <p className={styles.paragraph}>
        Domestic deliveries will incur a postage and handling fee of 10AUD. Domestic orders over 400AUD will receive free shipping. All product prices indicated are in Australian dollar currency. All prices are GST inclusive.
      </p>

      <h2 className={styles.heading}>International deliveries</h2>
      <p className={styles.paragraph}>
        We ship delivery duties unpaid (DDU). As such, any customs or import duties are charged once the parcel reaches the destination country. These charges must be paid by the recipient of the parcel. Unfortunately, we have no control over these charges, and cannot tell you what the cost would be, as customs policies and import duties vary widely from country to country. Please contact your local customs office for information on these prices, so you are not surprised by additional charges.
      </p>
      <p className={styles.paragraph}>
        International deliveries will be shipped via Australia Standard Shipping. You should receive your order within 14 days after you have received your dispatch confirmation email.
      </p>
      <p className={styles.paragraph}>
        International deliveries will incur a postage and handling fee of:
      </p>
      <ul className={styles.list}>
        <li><i>New Zealand:</i> 20AUD</li>
        <li><i>Asia Pacific:</i> 30AUD</li>
        <li><i>USA and Canada:</i> 30AUD</li>
        <li><i>UK and Europe:</i> 30AUD</li>
        <li><i>Rest of the World:</i> 50*AUD</li>
      </ul>
      <p className={styles.paragraph}>
        International orders over 400AUD will receive free shipping.
      </p>
      <p className={styles.paragraph}>
        <i>*Please email <a href="mailto:info@inlieuofficial.com" className={styles.link}>info@inlieuofficial.com</a> to enquire for deliveries out of listed regions
        </i>
      </p>
    </div>
  );
};

export default DeliveryAndReturns;
