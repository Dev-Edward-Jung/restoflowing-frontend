'use client';

import Link from 'next/link';
import Script from 'next/script';

export default function ErrorPage() {
    return (
        <div className="container-xxl container-p-y">
            <div className="misc-wrapper text-center">
                <h2 className="mb-2 mx-2">Under Maintenance!</h2>
                <p className="mb-4 mx-2">
                    Sorry for the inconvenience but we're performing some maintenance at the moment
                </p>
                <Link href="/page/owner/login" className="btn btn-primary">
                    Back to home
                </Link>
                <div className="mt-4">
                    <img
                        src="/img/illustrations/page-misc-error-light.png"
                        alt="under-maintenance"
                        width="500"
                        className="img-fluid"
                    />
                </div>

            </div>
        </div>
    );
}
