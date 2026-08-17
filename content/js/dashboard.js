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

    var data = {"OkPercent": 98.52941176470588, "KoPercent": 1.4705882352941178};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7620558375634517, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.03389830508474576, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aa00161b-e58b-4ef8-83d2-3cc4d041b329"], "isController": false}, {"data": [0.46153846153846156, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.46153846153846156, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc11741e-ba3a-4209-8bb0-888c10fd5308"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cbb83f12-568b-49e3-a11f-322b5ae0b0d9"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3bf38c1f-6ffa-409e-9e28-7d5dd6148d5a"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/65ce88e0-4585-4172-b2d7-72f5c412b9b4"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9d0074c6-c5b1-418a-a9ef-bf970f0d4a16"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3f858173-2fe3-4f74-aa18-8aa69dba4e1c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5ba77df1-1e45-4bfc-9c49-00bde437ff6a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9b1ac161-0e1f-4618-aa60-3274e27b20e5"], "isController": false}, {"data": [0.7391304347826086, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=77c97f7d-d651-4ecd-97e8-d59f95dba317"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=94cba7c8-8a45-4ae4-8c06-6e178413eecc"], "isController": false}, {"data": [0.6578947368421053, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ec2ea429-c425-4b08-8831-516badd6499a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/aa00161b-e58b-4ef8-83d2-3cc4d041b329"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/f7b8323b-e9bb-4912-9bec-958cd7533f72"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "register"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/bc11741e-ba3a-4209-8bb0-888c10fd5308"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ec2ea429-c425-4b08-8831-516badd6499a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=65ce88e0-4585-4172-b2d7-72f5c412b9b4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1930b7e8-758c-4a91-983b-0c1fe53afdfd"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9d0074c6-c5b1-418a-a9ef-bf970f0d4a16"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.3305084745762712, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3bf38c1f-6ffa-409e-9e28-7d5dd6148d5a"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.2391304347826087, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/94cba7c8-8a45-4ae4-8c06-6e178413eecc"], "isController": false}, {"data": [0.288135593220339, 500, 1500, "addBook"], "isController": true}, {"data": [0.9915254237288136, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/77c97f7d-d651-4ecd-97e8-d59f95dba317"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.4661016949152542, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9209039548022598, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3f858173-2fe3-4f74-aa18-8aa69dba4e1c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/9b1ac161-0e1f-4618-aa60-3274e27b20e5"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f7b8323b-e9bb-4912-9bec-958cd7533f72"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1930b7e8-758c-4a91-983b-0c1fe53afdfd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5ba77df1-1e45-4bfc-9c49-00bde437ff6a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1360, 20, 1.4705882352941178, 422.0191176470591, 114, 2658, 136.0, 1177.9, 1411.0, 1888.8700000000033, 5.257582903577476, 761.8887765404043, 3.859863337878952], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 59, 0, 0.0, 1946.559322033898, 1442, 2655, 1944.0, 2400.0, 2631.0, 2655.0, 0.2551803779264648, 307.0681585708169, 1.2547199246677248], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aa00161b-e58b-4ef8-83d2-3cc4d041b329", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 762.6153846153846, 521, 1668, 687.0, 1387.5999999999997, 1668.0, 1668.0, 0.07878644630703685, 0.014233879459767399, 0.05355016272431411], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 762.6153846153846, 521, 1668, 687.0, 1387.5999999999997, 1668.0, 1668.0, 0.07803261763417109, 0.014097689709298486, 0.05303779479822566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 156.45, 118, 357, 120.0, 355.0, 356.9, 357.0, 0.08988440865047549, 0.024051101533428012, 0.0512622018084743], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc11741e-ba3a-4209-8bb0-888c10fd5308", 1, 0, 0.0, 988.0, 988, 988, 988.0, 988.0, 988.0, 988.0, 1.0121457489878543, 0.18285836285425103, 0.6978270495951417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 144.25, 116, 357, 121.0, 331.6000000000005, 356.85, 357.0, 0.08987834965374365, 0.06679435945947161, 0.0451147184785393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 144.4, 116, 356, 120.0, 332.7000000000005, 355.95, 356.0, 0.08988562054785286, 0.024226983663288466, 0.05293069256870632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 179.5, 118, 358, 120.0, 356.6, 357.95, 358.0, 0.08988481261263691, 0.02422676589949979, 0.05284243866485099], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cbb83f12-568b-49e3-a11f-322b5ae0b0d9", 1, 0, 0.0, 325.0, 325, 325, 325.0, 325.0, 325.0, 325.0, 3.076923076923077, 0.9825721153846153, 1.8359375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3bf38c1f-6ffa-409e-9e28-7d5dd6148d5a", 1, 0, 0.0, 702.0, 702, 702, 702.0, 702.0, 702.0, 702.0, 1.4245014245014245, 0.2573562143874644, 0.9821269586894588], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/65ce88e0-4585-4172-b2d7-72f5c412b9b4", 3, 0, 0.0, 1075.3333333333335, 216, 2635, 375.0, 2635.0, 2635.0, 2635.0, 0.024566805332634545, 0.024638778395132496, 0.015754103680107438], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 301.2307692307693, 209, 610, 275.0, 517.1999999999999, 610.0, 610.0, 0.07862919078465884, 0.17154063692668736, 0.05083254326117593], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9d0074c6-c5b1-418a-a9ef-bf970f0d4a16", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 17, 0, 0.0, 159.9411764705882, 117, 545, 120.0, 393.79999999999984, 545.0, 545.0, 0.08778316525439045, 0.06523729370956166, 0.044063034121832705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 17, 0, 0.0, 160.05882352941177, 114, 357, 120.0, 352.2, 357.0, 357.0, 0.08778588506245708, 0.0467572797736157, 0.048764332982189795], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 9, 0, 0.0, 882.2222222222222, 690, 1178, 928.0, 1178.0, 1178.0, 1178.0, 0.11526639344262296, 33.892146876600926, 0.06573786501024591], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 9, 0, 0.0, 1230.0, 1041, 1409, 1294.0, 1409.0, 1409.0, 1409.0, 0.114585455286209, 103.10419408627648, 0.06523761760923813], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 9, 0, 0.0, 279.8888888888889, 118, 361, 352.0, 361.0, 361.0, 361.0, 0.11649580615097856, 0.2061429694780988, 0.06450500203867661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 137.7142857142857, 117, 357, 120.0, 244.0, 357.0, 357.0, 0.06162243056472556, 0.04579557583960562, 0.03093157159205951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 153.0, 118, 355, 120.0, 353.0, 355.0, 355.0, 0.061560921127268416, 0.016472355848507366, 0.03510896283039527], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 169.14285714285714, 116, 354, 119.0, 353.5, 354.0, 354.0, 0.06156065043224371, 0.016592519061815688, 0.03619092925801828], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 135.35714285714286, 115, 353, 119.0, 237.0, 353.0, 353.0, 0.0616243292852018, 0.01660968250265205, 0.03628854546775067], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3f858173-2fe3-4f74-aa18-8aa69dba4e1c", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 9, 0, 0.0, 172.11111111111111, 117, 359, 119.0, 359.0, 359.0, 359.0, 0.11649882206746576, 0.0865777378841225, 0.06541681903202423], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 701.6315789473683, 117, 1418, 971.0, 1409.0, 1418.0, 1418.0, 0.1120309441260407, 53.06990353177551, 0.06079475267694993], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 17, 0, 0.0, 339.35294117647055, 117, 1173, 120.0, 1153.0, 1173.0, 1173.0, 0.08778497844104205, 13.958734403643076, 0.05027666791459038], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 542.2105263157896, 117, 1059, 687.0, 955.0, 1059.0, 1059.0, 0.112030283554544, 17.351473271932875, 0.06090379878476624], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 17, 0, 0.0, 312.29411764705884, 115, 1057, 121.0, 962.5999999999999, 1057.0, 1057.0, 0.08778543174940874, 4.5745145820638875, 0.0503626554964008], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 619.3076923076924, 255, 1475, 493.0, 1280.1999999999998, 1475.0, 1475.0, 0.07821571895287202, 0.014130769537384106, 0.05392607185617934], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 325.5714285714285, 239, 711, 242.5, 593.0, 711.0, 711.0, 0.06152656189572127, 0.0953541540317477, 0.13837467973227155], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5ba77df1-1e45-4bfc-9c49-00bde437ff6a", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 0.5962510313531353, 2.2754228547854787], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9b1ac161-0e1f-4618-aa60-3274e27b20e5", 1, 0, 0.0, 897.0, 897, 897, 897.0, 897.0, 897.0, 897.0, 1.1148272017837235, 0.20140921125975472, 0.7686210981047937], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 621.7826086956521, 171, 1688, 473.0, 1282.8, 1610.399999999999, 1688.0, 0.0964931049383493, 0.059271643560763386, 0.043629206627398165], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 123.05263157894737, 118, 137, 121.0, 134.0, 137.0, 137.0, 0.1120309441260407, 0.08325737156241893, 0.05623428250076653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 236.42105263157893, 117, 463, 125.0, 358.0, 463.0, 463.0, 0.112030283554544, 0.11853697662694504, 0.05894027459212132], "isController": false}, {"data": ["login", 23, 0, 0.0, 3027.826086956522, 1829, 4524, 2955.0, 4155.200000000001, 4482.799999999999, 4524.0, 0.09892302928121667, 46.440628272793155, 0.21344138837396348], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=77c97f7d-d651-4ecd-97e8-d59f95dba317", 1, 0, 0.0, 266.0, 266, 266, 266.0, 266.0, 266.0, 266.0, 3.7593984962406015, 0.679188204887218, 2.5919290413533833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 17, 0, 0.0, 147.2941176470588, 120, 455, 125.0, 226.9999999999998, 455.0, 455.0, 0.08553889503874408, 0.06924974998742074, 0.03040640409580356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=94cba7c8-8a45-4ae4-8c06-6e178413eecc", 1, 0, 0.0, 255.0, 255, 255, 255.0, 255.0, 255.0, 255.0, 3.9215686274509802, 0.7084865196078431, 2.703737745098039], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 838.2631578947369, 240, 1539, 1089.0, 1530.0, 1539.0, 1539.0, 0.1119504118596731, 70.57250736331738, 0.23670354094733617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ec2ea429-c425-4b08-8831-516badd6499a", 3, 0, 0.0, 493.0, 232, 869, 378.0, 869.0, 869.0, 869.0, 0.019304646628443466, 0.02661301382534443, 0.012379607375661988], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aa00161b-e58b-4ef8-83d2-3cc4d041b329", 3, 0, 0.0, 393.66666666666663, 237, 650, 294.0, 650.0, 650.0, 650.0, 0.04291477126426916, 0.028092970381655362, 0.027520214645380937], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 350.29999999999995, 239, 716, 251.0, 686.9000000000005, 715.7, 716.0, 0.08983071401943038, 0.13922006166878517, 0.20203138123705877], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 0, 0.0, 1416.0, 1160, 1759, 1423.0, 1759.0, 1759.0, 1759.0, 0.11441502142103456, 136.88014271684824, 0.2579924652941102], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f7b8323b-e9bb-4912-9bec-958cd7533f72", 3, 0, 0.0, 667.3333333333333, 210, 1264, 528.0, 1264.0, 1264.0, 1264.0, 0.04180602006688963, 0.0273671570164437, 0.026809199066332216], "isController": false}, {"data": ["register", 23, 9, 39.130434782608695, 1065.8695652173915, 196, 2562, 1176.0, 1690.8, 2388.7999999999975, 2562.0, 0.10206481559550382, 0.031687242341810626, 0.0460487742237527], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/bc11741e-ba3a-4209-8bb0-888c10fd5308", 3, 0, 0.0, 793.3333333333333, 230, 1736, 414.0, 1736.0, 1736.0, 1736.0, 0.026961202829128884, 0.027040190728042347, 0.017289573428835903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 17, 0, 0.0, 515.2352941176472, 237, 1719, 250.0, 1358.9999999999998, 1719.0, 1719.0, 0.08772970992429442, 18.633481963158683, 0.1933450322406684], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 147.83333333333331, 120, 355, 122.5, 304.3000000000002, 355.0, 355.0, 0.1166940573551292, 0.09059743710676534, 0.04148109070045608], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ec2ea429-c425-4b08-8831-516badd6499a", 1, 0, 0.0, 1475.0, 1475, 1475, 1475.0, 1475.0, 1475.0, 1475.0, 0.6779661016949153, 0.12248411016949151, 0.4674258474576271], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=65ce88e0-4585-4172-b2d7-72f5c412b9b4", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 366.1764705882353, 237, 484, 474.0, 482.4, 484.0, 484.0, 0.10993843447669306, 0.1703831010883905, 0.2472541158201407], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 119.88888888888889, 116, 122, 120.0, 122.0, 122.0, 122.0, 0.04887744794551794, 0.036323962779823395, 0.02453418773827756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 145.0, 116, 352, 120.0, 352.0, 352.0, 352.0, 0.04887797884126605, 0.013078677932135642, 0.027875722307909544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1930b7e8-758c-4a91-983b-0c1fe53afdfd", 3, 0, 0.0, 1101.0, 344, 2309, 650.0, 2309.0, 2309.0, 2309.0, 0.02050090545665767, 0.024231376208699217, 0.013146739501827997], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 146.11111111111111, 118, 356, 120.0, 356.0, 356.0, 356.0, 0.04887797884126605, 0.013174142734559989, 0.028734905529728672], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d0074c6-c5b1-418a-a9ef-bf970f0d4a16", 3, 0, 0.0, 372.0, 321, 455, 340.0, 455.0, 455.0, 455.0, 0.021188535589676948, 0.029210106843190708, 0.013587700231661322], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 118.55555555555556, 116, 122, 118.0, 122.0, 122.0, 122.0, 0.048878244293464976, 0.013174214282222983, 0.028782794247030646], "isController": false}, {"data": ["https://demoqa.com/books", 59, 0, 0.0, 1359.3728813559326, 916, 2161, 1288.0, 1876.0, 2129.0, 2161.0, 0.25238482268896784, 301.93999109701844, 0.4983614369893485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3bf38c1f-6ffa-409e-9e28-7d5dd6148d5a", 3, 0, 0.0, 380.3333333333333, 213, 544, 384.0, 544.0, 544.0, 544.0, 0.022422697749508568, 0.0265028696381724, 0.01437913885629293], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, 39.130434782608695, 1065.8695652173915, 196, 2562, 1176.0, 1690.8, 2388.7999999999975, 2562.0, 0.09958693073079487, 0.030917953358677485, 0.04493082226330784], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 142.6, 118, 354, 119.0, 330.70000000000005, 354.0, 354.0, 0.05556913912289671, 0.014977619529218254, 0.0327228426670964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 165.79999999999998, 116, 357, 119.5, 356.4, 357.0, 357.0, 0.05556913912289671, 0.014977619529218254, 0.0326685759296717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 265.3333333333333, 117, 1404, 121.0, 1089.300000000001, 1404.0, 1404.0, 0.1088119548067681, 8.185983220856532, 0.06319027583830544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 207.74999999999994, 116, 940, 119.0, 764.2000000000006, 940.0, 940.0, 0.1088139281828074, 2.693127011924193, 0.06329768543706928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 165.29999999999998, 116, 353, 119.5, 352.8, 353.0, 353.0, 0.055568521543915804, 0.014868920803743095, 0.03169142244301448], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 121.33333333333333, 118, 138, 120.0, 132.9, 138.0, 138.0, 0.10880998150230314, 0.08086366789380145, 0.05461751024627325], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 122.10000000000001, 118, 134, 120.5, 133.2, 134.0, 134.0, 0.05556883033169035, 0.04129675769767222, 0.027892948037586757], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 137.75, 117, 347, 118.5, 279.5000000000002, 347.0, 347.0, 0.1088119548067681, 0.04273490347472843, 0.06129527597432038], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 1087.2307692307693, 425, 2635, 720.0, 2504.6, 2635.0, 2635.0, 0.07869868694267708, 0.014218024496479745, 0.05356736796781829], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 150.0, 121, 355, 123.0, 335.00000000000006, 355.0, 355.0, 0.05986590038314176, 0.047121011434386975, 0.021280456776819924], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1549.2173913043482, 889, 2658, 1527.0, 2215.2000000000003, 2584.799999999999, 2658.0, 0.09738829985434098, 0.05040605363554757, 0.04479481370253379], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 313.4, 238, 488, 242.0, 487.3, 488.0, 488.0, 0.05553149190906163, 0.08606296646453203, 0.12489162682282122], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/94cba7c8-8a45-4ae4-8c06-6e178413eecc", 3, 0, 0.0, 393.6666666666667, 233, 621, 327.0, 621.0, 621.0, 621.0, 0.05870726600262226, 0.02656350903113442, 0.03764756315923368], "isController": false}, {"data": ["addBook", 59, 11, 18.64406779661017, 1176.7627118644068, 605, 2919, 967.0, 2051.0, 2311.0, 2919.0, 0.26757490963677844, 77.01635073316659, 0.97365715802566], "isController": true}, {"data": ["https://demoqa.com/books-0", 59, 0, 0.0, 221.66101694915258, 118, 723, 121.0, 477.0, 480.0, 723.0, 0.2532884569152042, 0.18823487862545935, 0.12243924430959577], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/77c97f7d-d651-4ecd-97e8-d59f95dba317", 3, 0, 0.0, 915.6666666666666, 455, 1682, 610.0, 1682.0, 1682.0, 1682.0, 0.0949276967376515, 0.04295231069835142, 0.06087485760845489], "isController": false}, {"data": ["https://demoqa.com/books-3", 59, 0, 0.0, 791.9661016949149, 568, 1178, 710.0, 1019.0, 1092.0, 1178.0, 0.25309505220621675, 74.41834889528299, 0.12728901551386876], "isController": false}, {"data": ["https://demoqa.com/books-1", 59, 0, 0.0, 176.22033898305085, 115, 485, 122.0, 355.0, 362.0, 485.0, 0.253713243831328, 0.4489535134984046, 0.12338788616015757], "isController": false}, {"data": ["https://demoqa.com/books-2", 59, 0, 0.0, 1131.7796610169494, 795, 1648, 1161.0, 1419.0, 1643.0, 1648.0, 0.2529398903355526, 227.59575794483123, 0.12696396839108795], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 141.23529411764707, 121, 354, 123.0, 219.59999999999988, 354.0, 354.0, 0.10685909685205672, 0.07983125887873378, 0.03798506958412954], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 11, 6.214689265536723, 197.41242937853104, 118, 1266, 127.0, 360.2000000000001, 452.2, 1044.4799999999996, 0.7133587509370389, 1.5765736903116208, 0.34073144964976904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 152.22222222222223, 121, 356, 123.0, 356.0, 356.0, 356.0, 0.04967134129178602, 0.038466185199596006, 0.01765660959981456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3f858173-2fe3-4f74-aa18-8aa69dba4e1c", 3, 0, 0.0, 568.0, 275, 1004, 425.0, 1004.0, 1004.0, 1004.0, 0.02780532564670553, 0.027886786561686114, 0.017830889167971972], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 126.2, 119, 151, 123.0, 143.70000000000002, 150.7, 151.0, 0.09020996369048963, 0.07320749983085631, 0.03206682303060373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 293.3333333333333, 239, 478, 242.0, 478.0, 478.0, 478.0, 0.048845350194024584, 0.07570075269327833, 0.10985433739925647], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9b1ac161-0e1f-4618-aa60-3274e27b20e5", 3, 0, 0.0, 447.0, 281, 720, 340.0, 720.0, 720.0, 720.0, 0.037231005981781626, 0.030674373743453547, 0.02387535214326491], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 389.08333333333337, 238, 1523, 242.0, 1208.900000000001, 1523.0, 1523.0, 0.1086926985679737, 10.990602681199785, 0.24213492273760676], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 123.35714285714286, 119, 144, 121.0, 136.5, 144.0, 144.0, 0.06296237997796317, 0.05220220761844798, 0.022381158507791595], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f7b8323b-e9bb-4912-9bec-958cd7533f72", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 127.0, 120, 158, 124.0, 141.0, 158.0, 158.0, 0.11796406442079645, 0.09158342892044255, 0.04193253852457998], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1930b7e8-758c-4a91-983b-0c1fe53afdfd", 1, 0, 0.0, 737.0, 737, 737, 737.0, 737.0, 737.0, 737.0, 1.3568521031207597, 0.2451344131614654, 0.9354859226594301], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5ba77df1-1e45-4bfc-9c49-00bde437ff6a", 3, 0, 0.0, 629.0, 209, 1451, 227.0, 1451.0, 1451.0, 1451.0, 0.11367511651699443, 0.05143502993444735, 0.07289712875601531], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 120.3529411764706, 118, 127, 120.0, 123.0, 127.0, 127.0, 0.11002381692036864, 0.0817657467542974, 0.05522679872760692], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 188.52941176470588, 117, 356, 120.0, 355.2, 356.0, 356.0, 0.11002524108471944, 0.029440347712122193, 0.06274877030612906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 188.23529411764707, 115, 363, 119.0, 359.0, 363.0, 363.0, 0.11002524108471944, 0.029655240761115788, 0.06468280774707139], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 216.41176470588238, 114, 358, 120.0, 356.4, 358.0, 358.0, 0.11002381692036864, 0.02965485690431811, 0.06478941562791239], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 45.0, 0.6617647058823529], "isController": false}, {"data": ["401/Unauthorized", 11, 55.0, 0.8088235294117647], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1360, 20, "401/Unauthorized", 11, "406/Not Acceptable", 9, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
