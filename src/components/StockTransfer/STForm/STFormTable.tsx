import { Sheet, Select, Option, Autocomplete, Input, Button } from "@mui/joy";
import Table from "@mui/joy/Table";
import { useState, useEffect } from "react";
import type { Item, WarehouseItem, Warehouse } from "../../../interface";
import { STFormTableProps } from "../interface";
import axiosInstance from "../../../utils/axiosConfig";
import { toast } from "react-toastify";

const STFormTable = ({
  selectedWarehouse,
  selectedRow,
  warehouses,
  selectedWarehouseItems,
  setSelectedWarehouseItems,
  warehouseItems,
  setWarehouseItems,
  fetchSelectedItem,
}: STFormTableProps): JSX.Element => {
  const isEditDisabled =
    selectedRow !== undefined && selectedRow?.status !== "unposted";

  useEffect(() => {
    if (selectedWarehouse !== null) {
      // Fetch items for the selected warehouse
      axiosInstance
        .get(`/api/warehouse_items?warehouse_id=${selectedWarehouse?.id}`)
        .then((response) => {
          setWarehouseItems(response.data.items);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, [selectedWarehouse]);

  const addWarehouseToTransfer = (
    index: number,
    newValue: Warehouse,
    warehousePosition: number,
  ) => {
    const newWarehouseItem = {
      ...selectedWarehouseItems[index],
    };

    if (warehousePosition == 1) {
      newWarehouseItem.firstWarehouse = newValue;
    } else if (warehousePosition == 2) {
      newWarehouseItem.secondWarehouse = newValue;
    } else {
      newWarehouseItem.thirdWarehouse = newValue;
    }

    const newSelectedWarehouseItem = [...selectedWarehouseItems];
    newSelectedWarehouseItem[index] = newWarehouseItem;
    setSelectedWarehouseItems(newSelectedWarehouseItem);
  };

  const addWarehouseAmtToTransfer = (
    index: number,
    newValue: string,
    warehousePosition: number,
  ) => {
    const newWarehouseItem = {
      ...selectedWarehouseItems[index],
    };

    if (warehousePosition == 1) {
      newWarehouseItem.firstWarehouseAmt = newValue;
    } else if (warehousePosition == 2) {
      newWarehouseItem.secondWarehouseAmt = newValue;
    } else {
      newWarehouseItem.thirdWarehouseAmt = newValue;
    }

    const newSelectedWarehouseItem = [...selectedWarehouseItems];
    newSelectedWarehouseItem[index] = newWarehouseItem;
    setSelectedWarehouseItems(newSelectedWarehouseItem);
  };

  const handleRemoveItem = (index: number): void => {
    if (selectedWarehouseItems[index].id !== null) {
      setSelectedWarehouseItems(
        selectedWarehouseItems.filter((_: Item, i: number) => i !== index),
      );
    }
  };

  return (
    <Sheet
      sx={{
        "--TableCell-height": "40px",
        // the number is the amount of the header rows.
        "--TableHeader-height": "calc(1 * var(--TableCell-height))",
        "--Table-firstColumnWidth": "200px",
        "--Table-lastColumnWidth": "86px",
        // background needs to have transparency to show the scrolling shadows
        "--TableRow-stripeBackground": "rgba(0 0 0 / 0.04)",
        "--TableRow-hoverBackground": "rgba(0 0 0 / 0.08)",
        overflow: "auto",
        borderRadius: 8,
        marginTop: 3,
        background: (
          theme,
        ) => `linear-gradient(to right, ${theme.vars.palette.background.surface} 30%, rgba(255, 255, 255, 0)),
              linear-gradient(to right, rgba(255, 255, 255, 0), ${theme.vars.palette.background.surface} 70%) 0 100%,
              radial-gradient(
                farthest-side at 0 50%,
                rgba(0, 0, 0, 0.12),
                rgba(0, 0, 0, 0)
              ),
                0 100%`,
        backgroundSize:
          "40px calc(100% - var(--TableCell-height)), 40px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height)), 14px calc(100% - var(--TableCell-height))",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "local, local, scroll, scroll",
        backgroundPosition:
          "var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height), var(--Table-firstColumnWidth) var(--TableCell-height), calc(100% - var(--Table-lastColumnWidth)) var(--TableCell-height)",
        backgroundColor: "background.surface",
        maxHeight: "600px",
      }}
    >
      <Table
        className="h-5"
        sx={{
          "& tr > *:first-child": {
            position: "sticky",
            left: 0,
            boxShadow: "1px 0 var(--TableCell-borderColor)",
            bgcolor: "background.surface",
          },
        }}
        borderAxis="both"
      >
        <thead>
          <tr>
            <th
              style={{
                width: "var(--Table-firstColumnWidth)",
              }}
            >
              Selected Item
            </th>
            <th style={{ width: 250 }}>Stock No.</th>
            <th style={{ width: 300 }}>Product Name</th>
            <th style={{ width: 150 }}>Total Quantity</th>
            <th style={{ width: 200 }}>To Whse 1</th>
            <th style={{ width: 150 }}>Whse 1 Qty.</th>
            <th style={{ width: 200 }}>To Whse 2</th>
            <th style={{ width: 150 }}>Whse 2 Qty.</th>
            <th style={{ width: 200 }}>To Whse 3</th>
            <th style={{ width: 150 }}>Whse 3 Qty.</th>
            <th
              aria-label="last"
              style={{ width: "var(--Table-lastColumnWidth)" }}
            />
          </tr>
        </thead>
        <tbody>
          {selectedWarehouseItems.map(
            (selectedItem: WarehouseItem, index: number) => (
              <tr key={`${selectedItem.item_id}-${index}`}>
                <td style={{ zIndex: 10 }}>
                  {/* <Select
                    onChange={(_, value) => {
                      if (value !== null) {
                        fetchSelectedItem(value, index);
                      }
                    }}
                    className="mt-1 border-0"
                    size="sm"
                    placeholder="Select Item"
                    value={selectedItem.item_id}
                    disabled={isEditDisabled}
                  >
                    {warehouseItems.map((warehouseItem: WarehouseItem) => (
                      <Option
                        key={warehouseItem.item_id}
                        value={warehouseItem.item_id}
                      >
                        {warehouseItem.item.name}
                      </Option>
                    ))}
                  </Select> */}
                  <Autocomplete
                    placeholder="Select Stock"
                    options={warehouseItems}
                    getOptionLabel={(warehouseItem) =>
                      warehouseItem.item?.name ?? ""
                    }
                    onChange={(_, value) => {
                      if (value !== null) {
                        fetchSelectedItem(value.item_id, index);
                      }
                    }}
                    value={selectedItem}
                    disabled={isEditDisabled}
                    size="sm"
                    slotProps={{
                      listbox: {
                        sx: {
                          width: 300, // Increase the width
                          fontSize: "13px",
                        },
                      },
                    }}
                  />
                </td>
                <td>{selectedItem?.item?.stock_code}</td>
                <td>{selectedItem?.item?.name}</td>
                <td>{selectedItem?.on_stock}</td>
                <td>
                  {selectedItem?.id !== null && (
                    <Autocomplete
                      options={warehouses.items.filter(
                        (warehouseItem) => warehouseItem.id,
                      )}
                      getOptionLabel={(option) => option.name}
                      value={selectedWarehouseItems[index].firstWarehouse}
                      onChange={(event, newValue) => {
                        addWarehouseToTransfer(index, newValue, 1);
                      }}
                      size="sm"
                      className="w-[100%]"
                      placeholder="Select Warehouse"
                      required
                    />
                  )}
                </td>
                <td>
                  {selectedItem?.id !== null && (
                    <Input
                      type="number"
                      onChange={(e) =>
                        addWarehouseAmtToTransfer(
                          index,
                          e.target.value,
                          1,
                        )
                      }
                      slotProps={{
                        input: {
                          min: 0,
                          max: selectedItem.on_stock,
                        },
                      }}
                      value={selectedWarehouseItems[index].firstWarehouseAmt}
                      disabled={isEditDisabled}
                      required
                    />
                  )}
                </td>
                <td>
                  {selectedItem?.id !== null && (
                    <Autocomplete
                      options={warehouses.items.filter(
                        (warehouseItem) => warehouseItem.id,
                      )}
                      getOptionLabel={(option) => option.name}
                      value={selectedWarehouseItems[index].secondWarehouse}
                      onChange={(event, newValue) => {
                        addWarehouseToTransfer(index, newValue, 2);
                      }}
                      size="sm"
                      className="w-[100%]"
                      placeholder="Select Warehouse"
                    />
                  )}
                </td>
                <td>
                  {selectedItem?.id !== null && (
                    <Input
                      type="number"
                      onChange={(e) =>
                        addWarehouseAmtToTransfer(
                          index,
                          e.target.value,
                          2,
                        )
                      }
                      slotProps={{
                        input: {
                          min: 0,
                          max: selectedItem.on_stock,
                        },
                      }}
                      value={selectedWarehouseItems[index].secondWarehouseAmt}
                      disabled={isEditDisabled}
                    />
                  )}
                </td>
                <td>
                  {selectedItem?.id !== null && (
                    <Autocomplete
                      options={warehouses.items.filter(
                        (warehouseItem) => warehouseItem.id,
                      )}
                      getOptionLabel={(option) => option.name}
                      value={selectedWarehouseItems[index].thirdWarehouse}
                      onChange={(event, newValue) => {
                        addWarehouseToTransfer(index, newValue, 3);
                      }}
                      size="sm"
                      className="w-[100%]"
                      placeholder="Select Warehouse"
                    />
                  )}
                </td>
                <td>
                  {selectedItem?.id !== null && (
                    <Input
                      type="number"
                      onChange={(e) =>
                        addWarehouseAmtToTransfer(
                          index,
                          e.target.value,
                          3,
                        )
                      }
                      slotProps={{
                        input: {
                          min: 0,
                          max: selectedItem.on_stock,
                        },
                      }}
                      value={selectedWarehouseItems[index].thirdWarehouseAmt}
                      disabled={isEditDisabled}
                    />
                  )}
                </td>
                <td>
                  {selectedItem?.id !== null && (
                    <Button
                      size="sm"
                      variant="soft"
                      color="danger"
                      className="bg-delete-red"
                      onClick={() => handleRemoveItem(index)}
                      disabled={isEditDisabled}
                    >
                      Delete
                    </Button>
                  )}
                </td>
              </tr>
            ),
          )}
        </tbody>
      </Table>
    </Sheet>
  );
};

export default STFormTable;
