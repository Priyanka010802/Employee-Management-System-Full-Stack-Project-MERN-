# Quick Reference Guide - Recruitment Module Buttons

## 🎯 All Pages Have These Common Buttons:

### Header Buttons (Top Right)
```
┌─────────────────────────────────────────┐
│  [+ Add/Create/Post/Schedule New]      │  ← Click to open Add form
└─────────────────────────────────────────┘
```

### Item Action Buttons

#### On Cards (Students, Companies, Job Portal)
```
┌──────────────────────────────┐
│  Student/Company/Job Info    │
│  ┌────────┐  ┌────────┐     │
│  │  Edit  │  │ Delete │     │  ← Appear on hover
│  └────────┘  └────────┘     │
└──────────────────────────────┘
```

#### On Tables (Interview Calls, Offers)
```
┌────────────────────────────────────────────┐
│ Name  │ Position │ Date │ [Edit] [Delete] │
└────────────────────────────────────────────┘
```

## 📋 Page-by-Page Button Guide

### 1. Interview Calls Page
- **[+ Schedule New]** → Opens form to add new interview
- **[Edit]** → Opens form with existing data to modify
- **[Delete]** → Removes interview call (asks confirmation)

### 2. Students Page
- **[+ Add Student]** → Opens form to add new student
- **[Edit]** → Opens form to modify student details
- **[Remove]** → Deletes student (asks confirmation)

### 3. Companies Page
- **[+ Add Company]** → Opens form to add new company
- **[Edit]** → Opens form to modify company details
- **[Delete]** → Removes company (asks confirmation)

### 4. Job Portal Page
- **[+ Post New Job]** → Opens form to create job listing
- **[Edit]** → Opens form to modify job details
- **[Delete]** → Removes job listing (asks confirmation)

### 5. Offers Page
- **[+ Create Offer]** → Opens form to create new offer
- **[Edit]** → Opens form to modify offer details
- **[Delete]** → Removes offer (asks confirmation)

### 6. Schedule Page (Calendar)
- **[+ Add Schedule]** → Opens form to add new schedule
- **[Click on Event]** → Opens form to edit that schedule
- **[Delete]** (in edit form) → Removes schedule (asks confirmation)

### 7. Reports Page
- **[+ Generate Report]** → Opens form to create new report
- **[Edit]** → Opens form to modify report details
- **[Delete]** → Removes report (asks confirmation)
- **[Download Icon]** → Downloads report (UI ready)

## 🔄 Modal Form Buttons

When you click Add/Edit, a modal opens with these buttons:

```
┌─────────────────────────────────────────┐
│  Add/Edit Form                          │
│  [Input fields here...]                 │
│                                         │
│  ┌──────────────┐  ┌────────┐         │
│  │ Submit/Save  │  │ Cancel │         │
│  └──────────────┘  └────────┘         │
│                                         │
│  (For Edit mode only:)                  │
│  ┌──────────┐                          │
│  │  Delete  │  ← Red button             │
│  └──────────┘                          │
└─────────────────────────────────────────┘
```

### Modal Buttons:
- **[Submit/Save]** → Saves the data and closes modal
- **[Cancel]** → Closes modal without saving
- **[Delete]** → Deletes item (only in edit mode)
- **[X]** (top right) → Closes modal without saving

## ⚠️ Confirmation Dialogs

Before deleting anything, you'll see:
```
┌─────────────────────────────────────────┐
│  Are you sure you want to delete?      │
│                                         │
│     [Cancel]        [OK/Delete]        │
└─────────────────────────────────────────┘
```

## ✅ Success Messages

After any operation, you'll see an alert:
```
✓ "Interview call created successfully!"
✓ "Student updated successfully!"
✓ "Company deleted successfully!"
```

## 🎨 Button Colors by Page

| Page              | Primary Button Color |
|-------------------|---------------------|
| Interview Calls   | 🟢 Emerald Green    |
| Students          | 🔵 Cyan Blue        |
| Companies         | 🟣 Indigo Purple    |
| Job Portal        | 🔷 Sky Blue         |
| Offers            | 🟪 Purple           |
| Schedule          | 🔵 Blue             |
| Reports           | 🟢 Emerald Green    |

## 💡 Pro Tips

1. **Hover over cards** to see Edit/Delete buttons
2. **Click calendar events** to edit schedules directly
3. **All deletions ask for confirmation** - you won't lose data accidentally
4. **Forms validate automatically** - required fields are marked with *
5. **Press ESC or click outside** to close modals without saving

## 🔍 What Each Button Does

### Add/Create Buttons
✅ Opens empty form
✅ All fields are blank
✅ Saves as new item when submitted

### Edit Buttons
✅ Opens form with existing data
✅ All fields are pre-filled
✅ Updates existing item when submitted

### Delete Buttons
✅ Shows confirmation dialog
✅ Removes item from database
✅ Refreshes the list automatically

### Cancel Buttons
✅ Closes the modal
✅ Discards any changes
✅ Returns to the list view

---

**Remember**: All buttons are clearly labeled and provide feedback!
