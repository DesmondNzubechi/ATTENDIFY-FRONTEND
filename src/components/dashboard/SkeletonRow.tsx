import { TableCell, TableRow } from "../ui/table";

export const SkeletonRow = () => (
    <TableRow>
      {[...Array(5)].map((_, i) => (
        <TableCell key={i}>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        </TableCell>
      ))}
    </TableRow>
  );
  