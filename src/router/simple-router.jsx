import React from 'react'

// auth
import SignIn from '../views/partials/auth/sign-in'
import SignOut from '../views/partials/auth/sign-out'
import SignUp from '../views/partials/auth/sign-up'
import ChangePassword from '../views/partials/auth/change-password'
import ResetPassword from '../views/partials/auth/reset-password'
// errors
import Error404 from '../views/partials/errors/error404'
import Error500 from '../views/partials/errors/error500'
import Maintenance from '../views/partials/errors/maintenance'

//Trnasfer Certificate
import TcApplication from '../views/partials/tc/tc-app-new';
import TcAppCancel from '../views/partials/tc/tc-app-cancel';
import TcPayResponse from '../views/partials/tc/tc-pay-response';
import TcOrderPrint from '../views/partials/tc/tc-order';

// Payment Response
import PaymentVoucher from '../views/partials/public/paymet-voucher';

// Payment Failed
import PaymentFailed from '../views/partials/public/payment-failed';

// Order Emails
import OrderEmail from '../views/partials/public/order-email';
import EstablishmentOrder from '../views/partials/public/establishment-order';
import ClassStartOrder from '../views/partials/public/class-start-order';
import RecognitionOrder from '../views/partials/public/recognition-order';

// Institute Establishment
import InstEstablishmentNew from '../views/partials/institute/establishment-new';
import InstEstablishmentPayment from '../views/partials/institute/establishment-payment';

// Institute Class Start
import InstClassStartNew from '../views/partials/institute/commencement-new';
import InstClassStartPayment from '../views/partials/institute/commencement-payment';

// Payment Process
import PaymentProcess from '../views/partials/public/paymet-process'

export const SimpleRouter = [
    {
        path: 'auth/sign-in',
        element: <SignIn />
    },
    {
        path: 'auth/sign-out',
        element: <SignOut />
    },
    {
        path: 'auth/sign-up',
        element: <SignUp />
    },

    {
        path: 'auth/change-password',
        element: <ChangePassword />
    },
    {
        path: 'auth/reset-password',
        element: <ResetPassword />
    },
    {
        path: 'errors/error404',
        element: <Error404 />
    },
    {
        path: 'errors/error500',
        element: <Error500 />
    },
    {
        path: 'errors/maintenance',
        element: <Maintenance />
    },

    //TC
    {
        path: 'tc/new-app',
        element: <TcApplication />
    },
    {
        path: 'tc/cancel-app',
        element: <TcAppCancel />
    },
    {
        path: '/student/tc/application/print',
        element: <TcPayResponse />
    },
    {
        path: 'tc/tc-order',
        element: <TcOrderPrint />
    },
    {
        path: 'payment/response/success',
        element: <PaymentVoucher />
    },
    {
        path: 'payment/response/failed',
        element: <PaymentFailed />
    },
    {
        path: 'order-emails',
        element: <OrderEmail />
    },
    {
        path: 'institute/establishment/order',
        element: <EstablishmentOrder />
    },
    {
        path: 'institute/establishment/application',
        element: <InstEstablishmentNew />
    },
    {
        path: 'institute/establishment/payment',
        element: <InstEstablishmentPayment />
    },

    {
        path: 'institute/class-start/order',
        element: <ClassStartOrder />
    },
    {
        path: 'institute/class-start/application',
        element: <InstClassStartNew />
    },
    {
        path: 'institute/class-start/payment',
        element: <InstClassStartPayment />
    },

    {
        path: 'institute/recognition/order',
        element: <RecognitionOrder />
    },

    // Payment Process
    {
        path: 'payment/process',
        element: <PaymentProcess />
    },
]
