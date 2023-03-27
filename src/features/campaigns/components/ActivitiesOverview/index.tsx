import { FC } from 'react';
import NextLink from 'next/link';
import { Box, Button, Grid, Typography } from '@mui/material';

import ActivitiesOverviewCard from './ActivitiesOverviewCard';
import CampaignActivitiesModel from 'features/campaigns/models/CampaignActivitiesModel';
import messageIds from 'features/campaigns/l10n/messageIds';
import useModel from 'core/useModel';
import ZUIEmptyState from 'zui/ZUIEmptyState';
import ZUIFuture from 'zui/ZUIFuture';
import { Msg, useMessages } from 'core/i18n';

type ActivitiesOverviewProps = {
  campaignId?: number;
  orgId: number;
};

const ActivitiesOverview: FC<ActivitiesOverviewProps> = ({
  campaignId,
  orgId,
}) => {
  const messages = useMessages(messageIds);
  const activitiesModel = useModel(
    (env) => new CampaignActivitiesModel(env, orgId)
  );

  const todayDate = new Date();
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);

  return (
    <>
      <Box
        alignItems="center"
        display="flex"
        justifyContent="space-between"
        my={2}
      >
        <Box>
          <Typography variant="h4">
            <Msg id={messageIds.activitiesOverview.title} />
          </Typography>
        </Box>
        <Box>
          <NextLink
            href={`/organize/${orgId}/projects${
              campaignId ? `/${campaignId}` : ''
            }/activities`}
            passHref
          >
            <Button variant="text">
              <Msg id={messageIds.activitiesOverview.button} />
            </Button>
          </NextLink>
        </Box>
      </Box>

      <ZUIFuture future={activitiesModel.getActivityOverview(campaignId)}>
        {(data) => {
          const totalLength =
            data.today.length + data.tomorrow.length + data.alsoThisWeek.length;

          if (totalLength == 0) {
            return (
              <Box>
                <ZUIEmptyState
                  href={`/organize/${orgId}/projects/${
                    campaignId ? campaignId : ''
                  }/activities`}
                  linkMessage={messages.activitiesOverview.goToActivities()}
                  message={messages.activitiesOverview.noActivities()}
                />
              </Box>
            );
          }

          return (
            <Grid container spacing={2}>
              <Grid item md={4} xs={12}>
                <ActivitiesOverviewCard
                  activities={data.today}
                  focusDate={todayDate}
                  header={messages.activitiesOverview.todayCard()}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <ActivitiesOverviewCard
                  activities={data.tomorrow}
                  focusDate={tomorrowDate}
                  header={messages.activitiesOverview.tomorrowCard()}
                />
              </Grid>
              <Grid item md={4} xs={12}>
                <ActivitiesOverviewCard
                  activities={data.alsoThisWeek}
                  focusDate={null}
                  header={messages.activitiesOverview.thisWeekCard()}
                />
              </Grid>
            </Grid>
          );
        }}
      </ZUIFuture>
    </>
  );
};

export default ActivitiesOverview;
