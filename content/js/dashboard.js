/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 99.6189024390244, "KoPercent": 0.38109756097560976};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8045484508899143, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.11403508771929824, 500, 1500, "see books"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/338a3bd3-712c-4778-b7b8-86e91d19abaf"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7916666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/ce311426-08b4-4fd0-b0b9-55c7ab089bfd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/82c8b57b-a3d9-4ec9-99c3-c6e5a42b019c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4218dcc6-c6bf-46db-b520-34aff6803190"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/820217c6-5132-4ee6-935b-7b8cff727068"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bcf51627-93ed-476e-abc5-4d79d27bd844"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ffca179f-69d8-4e1f-9874-85bd604dbc1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/59b4785f-e2d7-4e2d-a553-22ac78f82f6a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6363636363636364, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=015638a7-641d-491c-a562-8b32dc574924"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0318be65-ee60-40ea-a2e6-6e0f4732a509"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b049331-30ef-47cd-a4fd-757aec309152"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/d6c8dcda-1b16-4721-8334-7549a785687a"], "isController": false}, {"data": [0.6470588235294118, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9d0703dd-e487-4b98-8d0f-120eaaa93180"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=93ca6685-520e-4125-a635-3109ba884189"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ce311426-08b4-4fd0-b0b9-55c7ab089bfd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9c7300bd-9d0f-44ff-8839-de8cf1c84722"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.4473684210526316, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=338a3bd3-712c-4778-b7b8-86e91d19abaf"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/325e3a18-aae8-4d2b-a727-7eba8523d1fb"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=820217c6-5132-4ee6-935b-7b8cff727068"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ffca179f-69d8-4e1f-9874-85bd604dbc1b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7727272727272727, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2631578947368421, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bcf51627-93ed-476e-abc5-4d79d27bd844"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/015638a7-641d-491c-a562-8b32dc574924"], "isController": false}, {"data": [0.3629032258064516, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6228070175438597, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9640883977900553, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=59b4785f-e2d7-4e2d-a553-22ac78f82f6a"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d0703dd-e487-4b98-8d0f-120eaaa93180"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d6c8dcda-1b16-4721-8334-7549a785687a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2b049331-30ef-47cd-a4fd-757aec309152"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/93ca6685-520e-4125-a635-3109ba884189"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bc91baa7-f2c6-4ec1-9335-6752de3f42e5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1312, 5, 0.38109756097560976, 360.21951219512187, 92, 3609, 115.0, 1004.1000000000001, 1180.35, 1836.1999999999935, 5.066536913892043, 696.3083784909675, 3.7036847639928325], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1664.9649122807018, 1147, 2266, 1692.0, 1913.8, 2018.599999999999, 2266.0, 0.24481591561152438, 294.5961374584994, 1.2037579444375246], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/338a3bd3-712c-4778-b7b8-86e91d19abaf", 3, 0, 0.0, 589.3333333333334, 208, 945, 615.0, 945.0, 945.0, 945.0, 0.02103963867927175, 0.02110127824571493, 0.013492216210340281], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 560.0, 461, 1012, 490.0, 926.2000000000003, 1012.0, 1012.0, 0.08537097244651864, 0.015423466701763623, 0.05802558283474314], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 560.0, 461, 1012, 490.0, 926.2000000000003, 1012.0, 1012.0, 0.08469492183364506, 0.015301328651586265, 0.05756607968380562], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ce311426-08b4-4fd0-b0b9-55c7ab089bfd", 3, 0, 0.0, 1091.0, 276, 2423, 574.0, 2423.0, 2423.0, 2423.0, 0.01657266284022296, 0.022846753622507886, 0.010627651626054436], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/82c8b57b-a3d9-4ec9-99c3-c6e5a42b019c", 2, 0, 0.0, 211.5, 211, 212, 211.5, 212.0, 212.0, 212.0, 0.020213658368959907, 0.028780775294866744, 0.01256444682797166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 134.74999999999997, 94, 299, 99.5, 296.2, 299.0, 299.0, 0.1192321449862883, 0.04309648209282222, 0.06737373036395612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 123.75000000000001, 95, 300, 101.0, 287.40000000000003, 300.0, 300.0, 0.11923125647388463, 0.08860838493811152, 0.059848501784742866], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 243.93749999999997, 95, 746, 291.0, 504.5000000000002, 746.0, 746.0, 0.11923303351193448, 2.2212828868925634, 0.06957200930017661], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4218dcc6-c6bf-46db-b520-34aff6803190", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.6584246134020618, 1.2302673969072164], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 182.3125, 94, 872, 100.0, 468.8000000000004, 872.0, 872.0, 0.11923303351193448, 6.735509285738239, 0.06945557079088761], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/820217c6-5132-4ee6-935b-7b8cff727068", 3, 0, 0.0, 319.3333333333333, 252, 395, 311.0, 395.0, 395.0, 395.0, 0.02364457475232308, 0.023713845967417775, 0.015162699304061349], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bcf51627-93ed-476e-abc5-4d79d27bd844", 3, 0, 0.0, 317.3333333333333, 206, 417, 329.0, 417.0, 417.0, 417.0, 0.043798817431929336, 0.028158419410175925, 0.028087132272428643], "isController": false}, {"data": ["goToProfile", 12, 0, 0.0, 220.58333333333337, 192, 276, 209.5, 268.8, 276.0, 276.0, 0.08532362540084328, 0.23123757919098983, 0.055160390639998294], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ffca179f-69d8-4e1f-9874-85bd604dbc1b", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 558.0, 1.7921146953405018, 0.32377072132616486, 1.2355790770609318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 98.28571428571428, 94, 101, 99.0, 101.0, 101.0, 101.0, 0.10803858520900321, 0.08029039389067524, 0.054230305466237944], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 126.0, 92, 302, 98.0, 297.8, 301.7, 302.0, 0.10803691775818251, 0.02890831588451368, 0.06161480465896347], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 689.0, 594, 784, 689.0, 784.0, 784.0, 784.0, 0.11440993078199188, 33.6403184171386, 0.06524941364910473], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 1075.0, 912, 1238, 1075.0, 1238.0, 1238.0, 1238.0, 0.1103448275862069, 99.28846982758621, 0.06282327586206897], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 293.0, 285, 301, 293.0, 301.0, 301.0, 301.0, 0.11646866992778943, 0.20609495108315862, 0.06448997641509434], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 112.61538461538461, 95, 284, 99.0, 212.39999999999992, 284.0, 284.0, 0.06658573938341605, 0.04948412858474572, 0.03342291996394126], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 141.76923076923077, 94, 297, 99.0, 294.2, 297.0, 297.0, 0.06651759902167961, 0.017798654425722867, 0.037935818192051655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 142.23076923076923, 94, 297, 99.0, 295.8, 297.0, 297.0, 0.06658437520807617, 0.01794656988030178, 0.039144329956310404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 142.15384615384616, 94, 298, 96.0, 297.6, 298.0, 298.0, 0.06651725867026882, 0.017928479875970897, 0.0391698310333712], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/59b4785f-e2d7-4e2d-a553-22ac78f82f6a", 3, 0, 0.0, 331.3333333333333, 243, 416, 335.0, 416.0, 416.0, 416.0, 0.028230245885441662, 0.028312951683934166, 0.01810338033669273], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 100.5, 99, 102, 100.5, 102.0, 102.0, 102.0, 0.1177301624676242, 0.08749282581822464, 0.06610824552625383], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 660.0588235294117, 94, 1177, 885.0, 1164.2, 1177.0, 1177.0, 0.10846263781135158, 57.42078588757529, 0.058281222086821155], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 116.66666666666667, 93, 293, 99.0, 248.60000000000014, 292.2, 293.0, 0.10803914103738155, 0.029119924732731745, 0.06351519814892939], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 494.47058823529403, 94, 897, 582.0, 812.9999999999999, 897.0, 897.0, 0.1084619458073078, 18.771692389161462, 0.05838677011490586], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 98.71428571428571, 93, 104, 99.0, 101.0, 103.69999999999999, 104.0, 0.10803969687147906, 0.029120074547390844, 0.06362103243506043], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 839.3636363636363, 416, 3083, 524.0, 2673.8000000000015, 3083.0, 3083.0, 0.08821383032470709, 0.015937068955147276, 0.06081930098558907], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=015638a7-641d-491c-a562-8b32dc574924", 1, 0, 0.0, 416.0, 416, 416, 416.0, 416.0, 416.0, 416.0, 2.403846153846154, 0.4342886117788462, 1.6573392427884617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 287.61538461538464, 192, 579, 202.0, 507.3999999999999, 579.0, 579.0, 0.06648426112972101, 0.10303761954381568, 0.1495246615056128], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0318be65-ee60-40ea-a2e6-6e0f4732a509", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.7018372252747253, 1.3113839285714286], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 19, 0, 0.0, 551.8421052631579, 106, 1418, 364.0, 1066.0, 1418.0, 1418.0, 0.08293285494170693, 0.05094215406087271, 0.03749796077930694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 122.94117647058825, 94, 296, 101.0, 283.2, 296.0, 296.0, 0.10845986984815617, 0.080603477494577, 0.05444177060737527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 190.82352941176467, 95, 307, 100.0, 302.2, 307.0, 307.0, 0.10846471387646507, 0.1248515588612481, 0.05650034613004281], "isController": false}, {"data": ["login", 19, 0, 0.0, 2824.7894736842104, 1593, 4520, 2577.0, 4520.0, 4520.0, 4520.0, 0.08436907473767878, 10.744308001518643, 0.14202156490202086], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b049331-30ef-47cd-a4fd-757aec309152", 1, 0, 0.0, 469.0, 469, 469, 469.0, 469.0, 469.0, 469.0, 2.1321961620469083, 0.3852112206823028, 1.4700493070362475], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 121.38095238095238, 98, 303, 102.0, 248.20000000000013, 300.9, 303.0, 0.10374827703754207, 0.08399152506261949, 0.036879270353188776], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d6c8dcda-1b16-4721-8334-7549a785687a", 3, 0, 0.0, 577.0, 238, 971, 522.0, 971.0, 971.0, 971.0, 0.05413501272172799, 0.03515603853510656, 0.03471548667376437], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 796.4117647058823, 200, 1278, 987.0, 1266.8, 1278.0, 1278.0, 0.10839002556729427, 76.34690671005987, 0.22745841130507966], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d0703dd-e487-4b98-8d0f-120eaaa93180", 3, 0, 0.0, 811.0, 192, 1784, 457.0, 1784.0, 1784.0, 1784.0, 0.03185524974515801, 0.02655641100174142, 0.020428008462878015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 388.56249999999994, 194, 973, 392.5, 710.5000000000002, 973.0, 973.0, 0.11914069771771102, 9.081460415968577, 0.26604501749879], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 2, 0, 0.0, 1176.0, 1014, 1338, 1176.0, 1338.0, 1338.0, 1338.0, 0.10972732759093652, 131.27203118999287, 0.24742226504635978], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=93ca6685-520e-4125-a635-3109ba884189", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["register", 21, 3, 14.285714285714286, 1224.047619047619, 588, 2543, 1201.0, 1684.0, 2459.299999999999, 2543.0, 0.08644572237750435, 0.027593165848176615, 0.0390018786507881], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ce311426-08b4-4fd0-b0b9-55c7ab089bfd", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 104.49999999999999, 100, 111, 104.5, 108.9, 111.0, 111.0, 0.07259067028410174, 0.05635701452720789, 0.02580371482755179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 236.71428571428572, 194, 400, 201.0, 398.0, 399.9, 400.0, 0.10798358649485278, 0.16735346852278454, 0.2428576168922324], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9c7300bd-9d0f-44ff-8839-de8cf1c84722", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 1.2824736445783134, 2.3963039658634537], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 399.8, 200, 1291, 390.0, 940.0000000000002, 1291.0, 1291.0, 0.07065872776605367, 5.737700302772648, 0.15770788828148552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 14, 0, 0.0, 112.21428571428571, 94, 286, 100.0, 194.0, 286.0, 286.0, 0.0758676001994234, 0.05638207397632931, 0.0380819790063512], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 14, 0, 0.0, 154.92857142857142, 92, 307, 100.0, 301.5, 307.0, 307.0, 0.07578751346581714, 0.03654040827816183, 0.042313285280440864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 14, 0, 0.0, 233.14285714285717, 95, 926, 100.5, 890.0, 926.0, 926.0, 0.07552992333712781, 9.726300547726819, 0.04347606915303981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 14, 0, 0.0, 245.35714285714286, 93, 792, 101.0, 783.0, 792.0, 792.0, 0.07559191166545179, 3.1926826017116166, 0.04358557071893307], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1155.7543859649122, 745, 1844, 1089.0, 1512.8, 1598.199999999999, 1844.0, 0.24383879261296795, 291.71596804535403, 0.48148636588224725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=338a3bd3-712c-4778-b7b8-86e91d19abaf", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.34477874522900764, 1.3157502385496183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/325e3a18-aae8-4d2b-a727-7eba8523d1fb", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 1.1323969414893618, 2.115885416666667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, 14.285714285714286, 1224.047619047619, 588, 2543, 1201.0, 1684.0, 2459.299999999999, 2543.0, 0.08537418284710703, 0.027251134257000684, 0.03851843015172212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 96.85714285714286, 94, 100, 97.0, 100.0, 100.0, 100.0, 0.03754538969432689, 0.010119655816049044, 0.022109248032889762], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 177.57142857142858, 95, 289, 100.0, 289.0, 289.0, 289.0, 0.03754538969432689, 0.010119655816049044, 0.022072582613266396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 220.68750000000003, 94, 1094, 99.5, 1057.6000000000001, 1094.0, 1094.0, 0.07064111224431228, 7.962034610281814, 0.04077040755506695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 193.75000000000003, 94, 753, 101.0, 741.1, 753.0, 753.0, 0.07064080036026808, 2.6130025154747503, 0.04083921270827999], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 100.62500000000001, 93, 107, 101.0, 107.0, 107.0, 107.0, 0.07064329550973553, 0.05249955847940306, 0.03545962294141022], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 181.42857142857144, 97, 299, 100.0, 299.0, 299.0, 299.0, 0.037545188315937394, 0.010046271092350435, 0.021412490211433044], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 124.49999999999999, 94, 303, 100.5, 299.5, 303.0, 303.0, 0.07064516698751347, 0.03216631748821109, 0.03954818552303915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 179.85714285714286, 100, 292, 102.0, 292.0, 292.0, 292.0, 0.03754498693970811, 0.027902085020622924, 0.018845823522470672], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=820217c6-5132-4ee6-935b-7b8cff727068", 1, 0, 0.0, 829.0, 829, 829, 829.0, 829.0, 829.0, 829.0, 1.2062726176115801, 0.21793011158021713, 0.8316684258142341], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ffca179f-69d8-4e1f-9874-85bd604dbc1b", 3, 0, 0.0, 375.6666666666667, 238, 572, 317.0, 572.0, 572.0, 572.0, 0.022634505549226278, 0.031203493164379325, 0.014514966123690028], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 131.85714285714286, 100, 299, 104.0, 299.0, 299.0, 299.0, 0.038762050844735836, 0.030509973614118245, 0.013778697761214691], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 539.3636363636364, 395, 971, 457.0, 903.6000000000003, 971.0, 971.0, 0.09000900090009001, 0.01626139176417642, 0.06126589221422143], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 19, 0, 0.0, 1603.4736842105262, 802, 3609, 1413.0, 2574.0, 3609.0, 3609.0, 0.08393115878008268, 0.04344093179047249, 0.038605054477948195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 363.14285714285717, 198, 582, 203.0, 582.0, 582.0, 582.0, 0.037524860219895685, 0.058156204266576604, 0.08439429012345678], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bcf51627-93ed-476e-abc5-4d79d27bd844", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/015638a7-641d-491c-a562-8b32dc574924", 3, 0, 0.0, 558.6666666666666, 195, 1033, 448.0, 1033.0, 1033.0, 1033.0, 0.017746438881264495, 0.02446489865304529, 0.011380366079456722], "isController": false}, {"data": ["addBook", 62, 2, 3.225806451612903, 1142.41935483871, 514, 3292, 868.5, 1902.8000000000002, 2697.1999999999985, 3292.0, 0.27702068719002726, 86.55069101581698, 1.0087553337652473], "isController": true}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 183.40350877192975, 96, 405, 102.0, 399.4, 403.1, 405.0, 0.24496426530059695, 0.1820486385681194, 0.11841534308964402], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 629.6315789473686, 464, 883, 586.0, 831.6, 855.3, 883.0, 0.24481591561152438, 71.98400784323621, 0.12312519193353033], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 157.0877192982456, 93, 422, 101.0, 298.4, 305.2, 422.0, 0.24512017339027, 0.43374780681950126, 0.11920883432456492], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 970.7192982456138, 644, 1444, 978.0, 1173.2, 1232.2999999999995, 1444.0, 0.2443049096714742, 219.82598716461652, 0.12262961286243919], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 102.33333333333333, 99, 105, 102.0, 105.0, 105.0, 105.0, 0.07366699571258085, 0.055034425507933936, 0.026186314882206473], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 2, 1.1049723756906078, 212.2983425414364, 95, 2694, 107.0, 368.0000000000004, 457.70000000000016, 2684.98, 0.752189036325328, 1.555034277067377, 0.36422793093990385], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 14, 0, 0.0, 105.85714285714286, 96, 130, 105.0, 122.0, 130.0, 130.0, 0.07498701117842088, 0.058070995961413824, 0.026655539129829296], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=59b4785f-e2d7-4e2d-a553-22ac78f82f6a", 1, 0, 0.0, 1037.0, 1037, 1037, 1037.0, 1037.0, 1037.0, 1037.0, 0.9643201542912248, 0.17421799662487947, 0.664853543876567], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d0703dd-e487-4b98-8d0f-120eaaa93180", 1, 0, 0.0, 3083.0, 3083, 3083, 3083.0, 3083.0, 3083.0, 3083.0, 0.3243593902043464, 0.058600085144339925, 0.223630595199481], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 116.75, 98, 290, 103.5, 181.5000000000001, 290.0, 290.0, 0.1245155566623605, 0.10104729256486483, 0.04426138928232346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 14, 0, 0.0, 389.2857142857142, 195, 1021, 211.5, 986.5, 1021.0, 1021.0, 0.07548838287707794, 13.001757632414712, 0.16701594085485202], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 349.12500000000006, 195, 1195, 206.5, 1153.7, 1195.0, 1195.0, 0.07060806785435321, 10.654724686456047, 0.15654098246713413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d6c8dcda-1b16-4721-8334-7549a785687a", 1, 0, 0.0, 923.0, 923, 923, 923.0, 923.0, 923.0, 923.0, 1.0834236186348862, 0.19573571235102924, 0.7469697995666306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 119.92307692307692, 99, 303, 105.0, 227.79999999999993, 303.0, 303.0, 0.06955405152350125, 0.057667372796340384, 0.024724291752494583], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b049331-30ef-47cd-a4fd-757aec309152", 3, 0, 0.0, 347.66666666666663, 196, 634, 213.0, 634.0, 634.0, 634.0, 0.0194829232177996, 0.026858782495892353, 0.012493931881206123], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 105.88235294117646, 95, 130, 104.0, 122.0, 130.0, 130.0, 0.10638431019161691, 0.0825932876975932, 0.03781629776342633], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/93ca6685-520e-4125-a635-3109ba884189", 3, 0, 0.0, 296.0, 192, 434, 262.0, 434.0, 434.0, 434.0, 0.016351179737618068, 0.019326540894300522, 0.01048561981871992], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc91baa7-f2c6-4ec1-9335-6752de3f42e5", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 1.5134404620853081, 2.827865817535545], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 122.33333333333334, 96, 404, 102.0, 228.2000000000001, 404.0, 404.0, 0.07069169466843239, 0.0525355269948018, 0.03548391705036548], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 190.0666666666667, 96, 303, 100.0, 300.6, 303.0, 303.0, 0.07069202782438215, 0.02599404773125719, 0.039920745400305394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 224.33333333333331, 95, 1181, 100.0, 654.8000000000003, 1181.0, 1181.0, 0.07069236098347212, 4.258390925516172, 0.041154367963164566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 179.73333333333335, 94, 735, 100.0, 475.20000000000016, 735.0, 735.0, 0.07069402682602671, 1.4035433760875098, 0.041224374888067794], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 3, 60.0, 0.22865853658536586], "isController": false}, {"data": ["401/Unauthorized", 2, 40.0, 0.1524390243902439], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1312, 5, "406/Not Acceptable", 3, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 3, "406/Not Acceptable", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 181, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
