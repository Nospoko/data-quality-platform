# Adding a New Data Problem to the Platform

Welcome to this tutorial on how to seamlessly integrate a new data problem into the platform. We assume you possess a fundamental grasp of programming concepts.

---

## Step 1: Installing the Project

Ensure you've accomplished the project installation as guided in the `README.md` file. This setup is pivotal in creating the necessary environment for your work.

## Step 2: Introducing the New Data Problem

1. Open your chosen code editor and navigate to the root directory of the project.

2. Within the `next` directory, locate and open the `src/pages/_app.tsx` file.

3. Inside this file, a key array named `ALLOWED_DATA_PROBLEMS` is present, encapsulating the list of currently permitted data problems:

   ```tsx
   const ALLOWED_DATA_PROBLEMS = ['data_problem_1', 'data_problem_2'];
   ```

4. To elegantly incorporate your new data problem, add its identifier within this array:

   ```tsx
   const ALLOWED_DATA_PROBLEMS = [
     'data_problem_1',
     'data_problem_2',
     'new_data_problem',
   ];
   ```

## Step 3: Defining the Data Problem in Environment Files

Given your reliance on Docker within the project, supplementary steps are indispensable to ensure your new data problem is recognized accurately:

1. Commence by building the Docker containers via the following command:

   ```shell
   docker-compose build
   ```

   This pivotal step guarantees that all amendments, including your fresh data problem, are seamlessly integrated into the project.

2. Once container building concludes, launch the project while specifying the data problem identifier:

   ```shell
   DATA_PROBLEM=new_data_problem docker-compose up
   ```

   Please ensure that `new_data_problem` is accurately replaced with the actual identifier of your recently added data problem.

3. It's imperative to verify that the `DATA_PROBLEM` value matches an entry within the `ALLOWED_DATA_PROBLEMS` array you defined earlier. This ensures accurate recognition and integration of your new data problem within the platform.

By diligently adhering to these steps, you'll be able to build and run the project, with your new data problem seamlessly incorporated within the Docker environment. This meticulous process guarantees accurate reflections of your changes, ensuring the platform functions optimally.

## Step 4: Further Guidelines and Recommendations

At this point, you've effectively integrated the new data problem into the platform. Depending on the intricacy of your project, additional steps might be necessary. These could encompass defining the data problem's structure, crafting suitable UI components, configuring data pipelines, and interacting with API endpoints.

---

# New Data Problem Workflow

## Developing New Visualization Components

1. Navigate to `next/src/modules`. Here you can see folders containing different components for pages. As you want to create a new data visualization component, navigate to the `dashboard` directory.
2. In the `dashboard` directory, you can create a folder for your data problem components. **Adopt a lucid naming convention and organize everything in folders!**
3. Also, in the `dashboard` directory, you can view the `common` folder. This folder contains universal components for data visualization, and if you think you've created one that can be shared between several data problems, please add it here.

After you've created a data visualization component, you need to add it to the pages. We have `history` and `dashboard` pages that require data visualization.

4. Navigate to `next/src/modules/dashboard/pages`. Here you can see two page components you need: `DashboardPage.tsx` and `HistoryPage.tsx`.
5. You want to conditionally render your component depending on the `DATA_PROBLEM` environmental variable. You can achieve it by doing something like this:

   ```tsx
   <WrapperComponent>
     {/* Conditionally render the list of visualized data records */}
     {DATA_PROBLEM === 'new_data_problem' &&
       data.map((record) => (
         <MyVisualizationComponent key={record.id} data={record.data} />
       ))}
   </WrapperComponent>
   ```

**Do not forget to type the data you are working with!**

## Working with API Endpoints

Data for your data problem must be fetched from some place. For fetching it, you can call different API endpoints that already exist (view `next/pages/api` and `next/services/reactQueryFn.ts`) or you can create a new one:

1. Navigate to `next/src/pages/api` and create a new folder for your API endpoint. See [Next.js API routing docs](https://nextjs.org/docs/pages/building-your-application/routing/api-routes).
2. Since our platform uses `next-connect`, you can easily create a router for your API endpoint for simplifying the development process.

**API endpoint example:**

```ts
// next/src/pages/api/ping/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createRouter } from 'next-connect';

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  res.status(200).json({ message: 'pong' });
});

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).json({ error: err.message });
  },
});
```

3. After creating an API endpoint, consider creating a query function in `next/services/reactQueryFn.ts`.

**Query function example:**

```ts
export const getPong = async (): Promise<{ message: 'pong' }> => {
  const { data } = await axiosApi.get<{ message: 'pong' }>(`/api/ping`);
  return data;
};
```

## Documenting Your Progress

As you advance, remember to document your modifications utilizing markdown formatting. This practice ensures lucidity and comprehension, benefiting both yourself and collaborators engaged in the project.

**Following this workflow will ensure a harmonious integration of your new data problem into the platform.**
