const fs = require('fs');

const data = JSON.parse(fs.readFileSync('coursesData.json', 'utf8'));

const regularDept = data.departments.find(d => d.id === 'iet-regular');
const premedicalDept = data.departments.find(d => d.id === 'iet-premedical');

// Fix regular department
const regularSem1 = regularDept.semesters.find(s => s.semester === 1);
const regularSem2 = regularDept.semesters.find(s => s.semester === 2);

// Move GER-1304 from Sem 2 to Sem 1
const calculusIndex = regularSem2.courses.findIndex(c => c.code === 'GER-1304');
if (calculusIndex !== -1) {
    const calculusCourse = regularSem2.courses.splice(calculusIndex, 1)[0];
    calculusCourse.id = 'sem1-8';
    regularSem1.courses.push(calculusCourse);
}

regularSem1.totalCredits = 18;
regularSem2.totalCredits = 15;

// Fix course codes in Sem 2 for regular
regularSem2.courses.forEach(c => {
    if (c.code === 'GER-2001') c.code = 'GER-2700';
    if (c.code === 'GER-2002') c.code = 'GER-2401';
    if (c.code === 'GER-2003') c.code = 'GER-2600';
    if (c.code === 'GER-2003L') c.code = 'GER-2600L';
});

// Fix Programming Fundamental in Sem 1 for regular
regularSem1.courses.forEach(c => {
    if (c.name === 'Programming Fundamentals (Theory)') c.name = 'Programming Fundamental (Theory)';
    if (c.name === 'Programming Fundamentals (Lab)') c.name = 'Programming Fundamental (Lab)';
});

// Fix premedical department
const premedSem2 = premedicalDept.semesters.find(s => s.semester === 2);

// Fix course codes in Sem 2 for premedical
premedSem2.courses.forEach(c => {
    if (c.code === 'GER-2001') c.code = 'GER-2700';
    if (c.code === 'GER-2002') c.code = 'GER-2401';
    if (c.code === 'GER-2003') c.code = 'GER-2600';
    if (c.code === 'GER-2003L') c.code = 'GER-2600L';
});

fs.writeFileSync('coursesData.json', JSON.stringify(data, null, 2) + '\n');
console.log('Fixed coursesData.json');
