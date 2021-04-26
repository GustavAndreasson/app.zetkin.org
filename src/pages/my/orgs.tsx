import { GetServerSideProps } from 'next';
import { Heading } from '@adobe/react-spectrum';
import { FormattedMessage as Msg } from 'react-intl';

import MyHomeLayout from '../../components/layout/MyHomeLayout';
import { PageWithLayout } from '../../types';
import { scaffold } from '../../utils/next';

const scaffoldOptions = {
    localeScope: [
        'layout.my',
        'misc.publicHeader',
        'pages.myOrgs',
    ],
};

export const getServerSideProps : GetServerSideProps = scaffold(async () => {
    return {
        props: {},
    };
}, scaffoldOptions);

const MyOrgsPage : PageWithLayout = () => {

    return (
        <Heading level={ 1 }>
            <Msg id="pages.myOrgs.heading"/>
        </Heading>
    );
};

MyOrgsPage.getLayout = function getLayout(page) {
    return (
        <MyHomeLayout>
            { page }
        </MyHomeLayout>
    );
};

export default MyOrgsPage;