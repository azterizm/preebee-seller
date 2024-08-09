import Dropdown from '../components/Dropdown'
import Header from '../components/dashboard/Header'
import { BaseHtml } from '../components/root'
import { AuthUser } from '../types/api'

interface Props {
  user: AuthUser
}

export default function Dashboard(props: Props) {
  return (
    <BaseHtml title='Dashboard | Preebee Seller Dashboard'>
      <body x-data='{
        toDates : [
          undefined,
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate() - new Date().getDay(),
          ),
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            1,
          ),
          new Date(
            new Date().getFullYear(),
            0,
            1,
          ),
      ],
        currentDate: new Date().toLocaleDateString()
        }'>
        <Header active='home' />
        <h1 class='mt-8 text-3xl font-bold' safe>
          Asalamualaikum, {props.user.name}
        </h1>
        <div
          class='mt-4 col-span-4'
          x-data='{sortBy:0}'
          x-init={`
        $watch([ 'sortBy' ],()=>{
          htmx.trigger('#list','sortByChange')
        })`}
        >
          <Dropdown
            jsVarName='sortBy'
            options={[
              <span>All time</span>,
              <span>
                Week
              </span>,
              <span>Month</span>,
              <span>Year</span>,
            ]}
            title='All time'
            titleAttr={{
              'x-text': `
                sortBy === 0  ? 'All time' :
                sortBy == 1 ? 'This week (' + toDates[1].toLocaleDateString() + ' to ' +  currentDate + ')' :
                sortBy == 2 ? 'This month (' + toDates[2].toLocaleDateString() + ' to ' +  currentDate + ')' :
                sortBy == 3 ? 'This year (' + toDates[3].toLocaleDateString() + ' to ' +  currentDate + ')' :
                'All time'
              `,
            }}
          />


          <div
            hx-get={`/dashboard/sales_table`}
            x-bind:hx-vals='`{"sortBy":${sortBy}}`'
            hx-target='this'
            hx-swap='innerHTML'
            hx-trigger='load,sortByChange'
            hx-indicator='.loader'
            id='list'
            class='overflow-x-auto'
          />

          <span class='loader htmx-indicator'></span>
        </div>
      </body>
    </BaseHtml>
  )
}
