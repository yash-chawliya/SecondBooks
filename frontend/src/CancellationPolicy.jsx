import React from 'react';

function CancellationPolicy() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Cancellation & Refund Policy</h1>
                    <p className="mt-4 text-lg text-gray-500">Last updated: August 27, 2025</p>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-md prose prose-lg max-w-none">
                    <h2>Our Policy</h2>
                    <p>
                        Thank you for shopping at SecondBooks. Due to the nature of our products, which include pre-owned items, we have a strict policy regarding returns and exchanges.
                    </p>

                    <h2>Cancellations</h2>
                    <p>
                        Orders, once placed, cannot be canceled by the user. Please review your cart carefully before confirming your purchase.
                    </p>

                    <h2>Returns and Exchanges</h2>
                    <p>
                        As a general rule, **we do not entertain any return or exchange requests** for products sold on our website. All sales are considered final. This applies to both new and pre-owned books.
                    </p>

                    <h2>Special Cases</h2>
                    <p>
                        In certain exceptional circumstances, such as receiving a completely incorrect item or a product with significant damage not mentioned in its description, we may consider a return or exchange. 
                    </p>
                    <p>
                        The decision to permit a return or exchange in such special cases is **solely at the discretion of SecondBooks**. To be considered, you must contact our support team within 24 hours of receiving your order, providing photographic evidence and a detailed description of the issue.
                    </p>

                    <h2>Contact Us</h2>
                    <p>
                        If you have any questions regarding our policy or believe your situation qualifies as a special case, please do not hesitate to contact our support team.
                    </p>
                    <p>
                        You can reach us at <a href="mailto:support@secondbooks.online" className="text-blue-600 hover:underline">support@secondbooks.online</a>.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default CancellationPolicy;
