<template>
  <div>
    <div v-for="(item, index) in phaseList" :key="index" class="r mt-5">
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <svg
            v-if="item.status === 'close'"
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <circle cx="11.5" cy="12.2302" r="9.5" fill="#FF7AC3" />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 5.23016C10.0109 5.23016 8.10322 6.02034 6.6967 7.42686C5.29018 8.83339 4.5 10.741 4.5 12.7302C4.5 14.7193 5.29018 16.6269 6.6967 18.0335C8.10322 19.44 10.0109 20.2302 12 20.2302C13.9891 20.2302 15.8968 19.44 17.3033 18.0335C18.7098 16.6269 19.5 14.7193 19.5 12.7302C19.5 10.741 18.7098 8.83339 17.3033 7.42686C15.8968 6.02034 13.9891 5.23016 12 5.23016ZM1.5 12.7302C1.5 6.93116 6.201 2.23016 12 2.23016C17.799 2.23016 22.5 6.93116 22.5 12.7302C22.5 18.5292 17.799 23.2302 12 23.2302C6.201 23.2302 1.5 18.5292 1.5 12.7302Z"
              fill="#FF7AC3" />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 5.23016C10.0664 5.22582 8.2066 5.97266 6.81301 7.31316C6.52428 7.58012 6.14228 7.72302 5.74923 7.71111C5.35618 7.6992 4.98353 7.53342 4.71151 7.24946C4.43948 6.96551 4.28984 6.58609 4.2948 6.19289C4.29975 5.7997 4.45891 5.42417 4.73801 5.14716C6.68993 3.27162 9.29305 2.226 12 2.23016C12.3978 2.23016 12.7794 2.3882 13.0607 2.6695C13.342 2.95081 13.5 3.33234 13.5 3.73016C13.5 4.12799 13.342 4.50952 13.0607 4.79082C12.7794 5.07213 12.3978 5.23016 12 5.23016Z"
              fill="#FF7AC3" />
          </svg>
          <svg
            v-else-if="item.status === 'open'"
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 5.23016C10.0109 5.23016 8.10322 6.02034 6.6967 7.42686C5.29018 8.83339 4.5 10.741 4.5 12.7302C4.5 14.7193 5.29018 16.6269 6.6967 18.0335C8.10322 19.44 10.0109 20.2302 12 20.2302C13.9891 20.2302 15.8968 19.44 17.3033 18.0335C18.7098 16.6269 19.5 14.7193 19.5 12.7302C19.5 10.741 18.7098 8.83339 17.3033 7.42686C15.8968 6.02034 13.9891 5.23016 12 5.23016ZM1.5 12.7302C1.5 6.93116 6.201 2.23016 12 2.23016C17.799 2.23016 22.5 6.93116 22.5 12.7302C22.5 18.5292 17.799 23.2302 12 23.2302C6.201 23.2302 1.5 18.5292 1.5 12.7302Z"
              fill="#FF7AC3" />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 5.23016C10.0664 5.22582 8.2066 5.97266 6.81301 7.31316C6.52428 7.58012 6.14228 7.72303 5.74923 7.71111C5.35618 7.6992 4.98353 7.53342 4.71151 7.24946C4.43948 6.96551 4.28984 6.58609 4.2948 6.19289C4.29975 5.7997 4.45891 5.42417 4.73801 5.14716C6.68993 3.27162 9.29305 2.226 12 2.23016C12.3978 2.23016 12.7794 2.3882 13.0607 2.6695C13.342 2.95081 13.5 3.33234 13.5 3.73016C13.5 4.12799 13.342 4.50952 13.0607 4.79082C12.7794 5.07213 12.3978 5.23016 12 5.23016Z"
              fill="#FF7AC3" />
          </svg>

          <svg
            v-else
            width="24"
            height="25"
            viewBox="0 0 24 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 5.23016C10.0109 5.23016 8.10322 6.02034 6.6967 7.42686C5.29018 8.83339 4.5 10.741 4.5 12.7302C4.5 14.7193 5.29018 16.6269 6.6967 18.0335C8.10322 19.44 10.0109 20.2302 12 20.2302C13.9891 20.2302 15.8968 19.44 17.3033 18.0335C18.7098 16.6269 19.5 14.7193 19.5 12.7302C19.5 10.741 18.7098 8.83339 17.3033 7.42686C15.8968 6.02034 13.9891 5.23016 12 5.23016ZM1.5 12.7302C1.5 6.93116 6.201 2.23016 12 2.23016C17.799 2.23016 22.5 6.93116 22.5 12.7302C22.5 18.5292 17.799 23.2302 12 23.2302C6.201 23.2302 1.5 18.5292 1.5 12.7302Z"
              fill="#CCCCCC" />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M12 5.23016C10.0664 5.22581 8.2066 5.97266 6.81301 7.31316C6.52428 7.58012 6.14228 7.72302 5.74923 7.71111C5.35618 7.69919 4.98353 7.53341 4.71151 7.24946C4.43948 6.9655 4.28984 6.58609 4.2948 6.19289C4.29975 5.79969 4.45891 5.42417 4.73801 5.14716C6.68993 3.27162 9.29305 2.226 12 2.23016C12.3978 2.23016 12.7794 2.3882 13.0607 2.6695C13.342 2.95081 13.5 3.33234 13.5 3.73016C13.5 4.12799 13.342 4.50952 13.0607 4.79082C12.7794 5.07213 12.3978 5.23016 12 5.23016Z"
              fill="#CCCCCC" />
          </svg>

          <span class="ml-2">{{ item.title }}</span>
        </div>
        <div class="flex items-center">
          <span class="mr-2">{{ getStatusName(item.status) }}</span>
          <span
            class="flex"
            @click="phaseList[index].expand = !phaseList[index].expand">
            <svg
              v-if="item.expand"
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10 15.7927L9.46875 15.2614L3.46875 9.26141L2.9375 8.73016L4 7.66766L4.53125 8.19891L10 13.6989L15.4688 8.23016L16 7.69891L17.0625 8.73016L16.5312 9.26141L10.5312 15.2614L10 15.7927Z"
                fill="currentColor" />
            </svg>

            <svg
              v-else
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M15.0312 10.7302L14.5 11.2614L8.53125 17.2614L8 17.7927L6.9375 16.7302L7.46875 16.1989L12.9375 10.7302L7.46875 5.26141L6.9375 4.73016L8 3.69891L8.53125 4.23016L14.5312 10.1989L15.0625 10.7302H15.0312Z"
                fill="currentColor" />
            </svg>
          </span>
        </div>
      </div>
      <div v-if="item.expand" class="border-l border-k-shade mt-4 pl-5">
        <div class="flex justify-between items-center">
          <div>
            <span class="has-text-grey">From</span> 9AM
            <span class="has-text-grey">UTC+1</span>
          </div>
          <span class="has-text-grey">Available for mint</span>
        </div>
        <div class="flex justify-between items-center">
          <div>
            <span class="has-text-grey">To</span> 11PM
            <span class="has-text-grey">UTC+1</span>
          </div>
          <span class="">10 NFTs</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const phaseList = ref<
  {
    title: string
    status: 'close' | 'open' | 'upcoming'
    expand: boolean
  }[]
>([
  {
    title: 'Zero Phase',
    status: 'close',
    expand: false,
  },
  {
    title: 'First Phase',
    status: 'open',
    expand: true,
  },
  {
    title: 'Second Phase',
    status: 'upcoming',
    expand: true,
  },
  {
    title: 'Third Phase',
    status: 'upcoming',
    expand: false,
  },
])

const getStatusName = (status: 'close' | 'open' | 'upcoming') => {
  switch (status) {
    case 'close':
      return 'Minted Out'
    case 'open':
      return 'In Progress'
    case 'upcoming':
      return 'Upcoming'
  }
}
</script>
