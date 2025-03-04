// This is a debug page to view all forms in the system
// Access at /debug/forms

import React from 'react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Card } from '@/components/ui/card'

export default async function DebugFormsPage() {
  const forms = await getAllForms()
  
  return (
    <div className="container py-16">
      <h1 className="text-3xl font-bold mb-8">All Forms Debug</h1>
      
      {forms.length === 0 ? (
        <div className="p-6 bg-yellow-50 rounded-lg border border-yellow-200">
          <h2 className="text-xl font-semibold mb-2">No Forms Found</h2>
          <p>There are no forms in the database.</p>
          <p className="mt-4">To create a form:</p>
          <ol className="list-decimal ml-6 mt-2">
            <li>Go to the Payload admin (/admin)</li>
            <li>Navigate to the Forms collection</li>
            <li>Create a new form</li>
          </ol>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {forms.map(form => (
            <Card key={form.id} className="p-6">
              <h2 className="text-xl font-bold mb-2">{form.title}</h2>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">ID:</span> {form.id}</p>
                <p><span className="font-medium">Slug:</span> {form.slug}</p>
                <p><span className="font-medium">Fields:</span> {form.fields?.length || 0}</p>
                <p><span className="font-medium">Submissions:</span> {form.submissions?.length || 0}</p>
                <p><span className="font-medium">Created:</span> {new Date(form.createdAt).toLocaleString()}</p>
              </div>
              
              {form.fields && form.fields.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Fields:</h3>
                  <ul className="text-sm space-y-1 ml-4 list-disc">
                    {form.fields.map((field, index) => (
                      <li key={index}>
                        {field.label || field.name} ({field.blockType})
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-6 flex gap-4">
                <a 
                  href={`/admin/collections/forms/${form.id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm px-4 py-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                >
                  Edit in Admin
                </a>
                {form.id === '67c72586f855d44d70291478' ? (
                  <div className="bg-green-100 text-green-700 px-4 py-2 text-sm rounded">
                    This is the adoption form
                  </div>
                ) : (
                  <div className="text-sm px-4 py-2 rounded text-gray-500">
                    Not the adoption form
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
      
      <div className="mt-12 p-6 bg-gray-50 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Instructions for Adoption Form</h2>
        <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-6">
          <p className="font-medium text-blue-700">Current Configuration</p>
          <p className="text-sm text-blue-600 mt-1">
            The application is configured to use the form with ID: <code className="bg-blue-100 px-1 py-0.5 rounded">67c72586f855d44d70291478</code>
          </p>
        </div>
        
        <ol className="list-decimal ml-6 space-y-3">
          <li>
            <strong>Create a form in Payload Admin</strong>
            <p className="text-gray-600 mt-1">Go to the Forms collection in Payload admin and create a new form.</p>
          </li>
          <li>
            <strong>Check the form ID</strong>
            <p className="text-gray-600 mt-1">Make sure the form ID matches <code>67c72586f855d44d70291478</code> or update the ID in the code.</p>
          </li>
          <li>
            <strong>Add form fields</strong>
            <p className="text-gray-600 mt-1">Add all the required fields for adoption like name, address, contact info, etc.</p>
          </li>
          <li>
            <strong>Configure confirmation message or redirect</strong>
            <p className="text-gray-600 mt-1">Set up what happens after the form is submitted.</p>
          </li>
          <li>
            <strong>Set up email notifications</strong>
            <p className="text-gray-600 mt-1">Configure emails to be sent when the form is submitted.</p>
          </li>
        </ol>
        
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
          <h3 className="font-semibold text-yellow-800 mb-2">Modifying the Code</h3>
          <p className="text-sm text-yellow-700">
            If you've created a different form and want to use it instead, you'll need to update the ID in:
            <br /><code className="bg-yellow-100 px-1 py-0.5 mt-1 inline-block">/src/app/(frontend)/adopt/application/[dogId]/page.tsx</code>
          </p>
        </div>
      </div>
    </div>
  )
}

async function getAllForms() {
  try {
    const payload = await getPayload({ config: configPromise })
    
    const { docs } = await payload.find({
      collection: 'forms',
      limit: 100,
      depth: 1,
    })
    
    return docs || []
  } catch (error) {
    console.error('Error fetching forms:', error)
    return []
  }
}