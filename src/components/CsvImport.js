'use client'
import { useState } from 'react'
import Papa from 'papaparse'

export default function CsvImport() {
  const [errors, setErrors] = useState([])
  const [file, setFile] = useState(null)

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      Papa.parse(selectedFile, {
        header: true,
        complete: async (results) => {
          if (results.data.length > 200) {
            alert('Max 200 rows')
            return
          }

          const rowErrors = []
          const validRows = []

          results.data.forEach((row, index) => {
            try {
              const validated = csvBuyerSchema.parse(row)
              validRows.push(validated)
            } catch (err) {
              rowErrors.push({ row: index + 1, message: err.message })
            }
          })

          if (rowErrors.length > 0) {
            setErrors(rowErrors)
            // Show table
            // For now, alert
            alert(`Errors: ${JSON.stringify(rowErrors)}`)
          } else {
            // Post to /api/buyers/import
            const res = await fetch('/api/buyers/import', {
              method: 'POST',
              body: JSON.stringify(validRows),
            })
            if (res.ok) {
              alert('Imported successfully')
            }
          }
        },
      })
    }
  }

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} className="p-2 border" aria-label="CSV Import" />
      {errors.length > 0 && (
        <table className="mt-2 w-full border">
          <thead><tr><th>Row</th><th>Error</th></tr></thead>
          <tbody>{errors.map((err) => <tr key={err.row}><td>{err.row}</td><td>{err.message}</td></tr>)}</tbody>
        </table>
      )}
    </div>
  )
}