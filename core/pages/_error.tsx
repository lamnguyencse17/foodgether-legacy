import * as Sentry from '@sentry/nextjs'
import { NextPage, NextPageContext } from 'next'
import NextErrorComponent from 'next/error'
import React from 'react'

interface ErrorProps {
  statusCode: number
}

const CustomErrorComponent: NextPage<ErrorProps> = ({ statusCode }) => {
  return <NextErrorComponent statusCode={statusCode} />
}

CustomErrorComponent.getInitialProps = async (contextData: NextPageContext) => {
  await Sentry.captureUnderscoreErrorException(contextData)

  return NextErrorComponent.getInitialProps(contextData)
}

export default CustomErrorComponent
