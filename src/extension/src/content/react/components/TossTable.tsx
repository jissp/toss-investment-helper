import { TextAlign } from '@extension/src/content/common.types';
import React, { ReactNode } from 'react';

type Row = string | number | ReactNode;

type TossTableRowOptions = {
    fieldOptions: TossTableFieldOptions[];
};

export type TossTableFieldOptions = {
    textAlign?: TextAlign;
};

type TossTableProps = {
    fields: string[];
    rows: Row[][];
    rowOptions?: TossTableRowOptions;
};

type TossTableBodyProps = {
    rows: Row[][];
    rowOptions?: TossTableRowOptions;
};

type TossTableRowProps = {
    index: number;
    row: Row[];
    rowOptions?: TossTableRowOptions;
};

const RowStyleMap = {
    textAlign: {
        [TextAlign.Left]: 'tw4l-kvawo25',
        [TextAlign.Center]: 'tw4l-kvawo26',
        [TextAlign.Right]: 'tw4l-kvawo27',
    },
};

const defaultRowFieldOptions: Required<TossTableFieldOptions> = {
    textAlign: TextAlign.Right,
};

function getGridTemplateColumnsStyle(repeat: number) {
    return `repeat(${repeat}, minmax(100px, 1fr))`;
}

export const TossTableHead = ({ fields }: { fields: string[] }) => {
    return (
        <thead
            className="tw4l-4pu5o90"
            style={{ zIndex: 2, position: 'sticky', top: '0px' }}
        >
            <tr
                className="auto-zebra-pattern f2ww7n1"
                style={{
                    gridTemplateColumns: getGridTemplateColumnsStyle(
                        fields.length,
                    ),
                }}
            >
                {fields.map((field, index) => (
                    <th className="tw4l-1apn5az0" key={index}>
                        <div className="tw4l-1apn5az2 tw4l-1apn5az1 tw4l-1apn5az4 tw4l-kvawo26">
                            <div className="tw4l-1apn5azd">{field}</div>
                        </div>
                    </th>
                ))}
            </tr>
        </thead>
    );
};

export const TossTableBody = ({ rows, rowOptions }: TossTableBodyProps) => {
    return (
        <tbody
            style={{
                display: 'block',
                height: `${rows.length * 44}px`,
                position: 'relative',
            }}
        >
            {rows.map((row, index) => (
                <TossRow
                    key={index}
                    index={index}
                    row={row}
                    rowOptions={rowOptions}
                />
            ))}
        </tbody>
    );
};

export const TossRow = ({ index, row, rowOptions }: TossTableRowProps) => {
    const fieldComponents = row.map((item, index) => {
        const fieldOptions =
            rowOptions?.fieldOptions[index] ?? defaultRowFieldOptions;

        return (
            <td className="tw4l-mq48z20">
                <div
                    className={`tw4l-mq48z22 ${RowStyleMap.textAlign[fieldOptions.textAlign!]} tw4l-mq48z25`}
                >
                    <div className="tw4l-mq48z2h">{item}</div>
                </div>
            </td>
        );
    });

    return (
        <tr
            data-index={index}
            data-known-size="32"
            className={`${index % 2 === 0 ? 'manual-zebra-pattern' : ''} f2ww7n1 _1p5yqoh0`}
            style={{
                gridTemplateColumns: getGridTemplateColumnsStyle(row.length),
            }}
        >
            {fieldComponents}
        </tr>
    );
};

export const TossTable = ({ fields, rows, rowOptions }: TossTableProps) => {
    return (
        <table
            className="tw4l-kvawo28 tw4l-kvawo2a tw4l-kvawo2c tw4l-kvawo2b tw4l-kvawo2e _1p5yqoh0"
            style={{ borderSpacing: '0px', overflowAnchor: 'none' }}
        >
            <TossTableHead fields={fields} />
            <TossTableBody rows={rows} rowOptions={rowOptions} />
        </table>
    );
};
