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

    var data = {"OkPercent": 97.20496894409938, "KoPercent": 2.7950310559006213};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.791970802919708, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b647da5c-83ee-4365-9257-56f5619268f5"], "isController": false}, {"data": [0.3584905660377358, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/cea0fda2-ec5d-420d-8221-0d189b8c4095"], "isController": false}, {"data": [0.6, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f71ec898-3fa2-4305-b257-0d0995288779"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9d78a5f6-21f3-4ea0-b6ec-5aa4bbd3f786"], "isController": false}, {"data": [0.6875, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f090b324-b6f6-4c98-818b-49b6bf299de1"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/31b81781-f38f-440a-925b-fd28c7f8d224"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f090b324-b6f6-4c98-818b-49b6bf299de1"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a357932e-1de9-468b-9c64-5f4b47037f80"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/702744c9-8716-4fdb-b793-24c73b094009"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=33edac9e-e8d7-4d3e-8586-8631e639f3f4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2209d3f0-81b0-4d58-9d9c-db00fb74383a"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7646f878-abfb-47c3-b7aa-1b3f98bb2825"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a55d43eb-1a13-42f2-9b5a-032659b745a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f71ec898-3fa2-4305-b257-0d0995288779"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cea0fda2-ec5d-420d-8221-0d189b8c4095"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=31b81781-f38f-440a-925b-fd28c7f8d224"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.49056603773584906, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/30f613ff-66b1-4090-ae8f-a95b1829648c"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.30833333333333335, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b647da5c-83ee-4365-9257-56f5619268f5"], "isController": false}, {"data": [0.9905660377358491, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c4545831-2c37-4853-a0b1-da32a9eb60f0"], "isController": false}, {"data": [0.7924528301886793, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49056603773584906, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9161849710982659, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c4545831-2c37-4853-a0b1-da32a9eb60f0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/33edac9e-e8d7-4d3e-8586-8631e639f3f4"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a357932e-1de9-468b-9c64-5f4b47037f80"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=702744c9-8716-4fdb-b793-24c73b094009"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7646f878-abfb-47c3-b7aa-1b3f98bb2825"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0b0f4089-084b-4893-b0eb-2d920f2e37b6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2209d3f0-81b0-4d58-9d9c-db00fb74383a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1288, 36, 2.7950310559006213, 318.9790372670807, 81, 3566, 100.0, 890.4000000000005, 1067.0, 1620.089999999998, 5.083294195651574, 702.0728536229325, 3.7109521457974024], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/b647da5c-83ee-4365-9257-56f5619268f5", 3, 0, 0.0, 325.3333333333333, 196, 465, 315.0, 465.0, 465.0, 465.0, 0.03591652998431645, 0.023090868072599278, 0.0230324101787446], "isController": false}, {"data": ["see books", 53, 0, 0.0, 1411.6603773584905, 1019, 2137, 1377.0, 1738.2, 1766.3999999999999, 2137.0, 0.2302525827388762, 277.07287484061527, 1.1321501504787517], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/cea0fda2-ec5d-420d-8221-0d189b8c4095", 3, 0, 0.0, 447.33333333333337, 264, 790, 288.0, 790.0, 790.0, 790.0, 0.01876583367216089, 0.02587021666718794, 0.01203407953585838], "isController": false}, {"data": ["deleteBook", 15, 4, 26.666666666666668, 426.06666666666666, 85, 971, 476.0, 836.0000000000001, 971.0, 971.0, 0.08891892372534724, 0.018773702450605535, 0.05930243845328496], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, 26.666666666666668, 426.06666666666666, 85, 971, 476.0, 836.0000000000001, 971.0, 971.0, 0.08612868774331353, 0.018184592080180067, 0.05744155450797552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 101.69999999999997, 82, 263, 84.0, 228.40000000000032, 262.0, 263.0, 0.09176332403464983, 0.031445068753670535, 0.051948436467662604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 86.39999999999999, 82, 100, 85.0, 91.50000000000001, 99.6, 100.0, 0.09176248199161291, 0.06819457890197014, 0.04606046459344632], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 159.20000000000002, 82, 659, 85.0, 327.00000000000017, 642.7999999999997, 659.0, 0.09176290301119966, 1.3725633364762126, 0.053641868889164175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 158.60000000000002, 82, 902, 84.0, 252.9, 869.5499999999995, 902.0, 0.09176374506196347, 4.151955492576313, 0.05355274809475524], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f71ec898-3fa2-4305-b257-0d0995288779", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9d78a5f6-21f3-4ea0-b6ec-5aa4bbd3f786", 1, 0, 0.0, 434.0, 434, 434, 434.0, 434.0, 434.0, 434.0, 2.304147465437788, 0.7357970910138248, 1.3748379896313365], "isController": false}, {"data": ["goToProfile", 16, 4, 25.0, 323.0, 83, 2319, 196.5, 918.3000000000014, 2319.0, 2319.0, 0.08657305954603252, 0.15477365033952872, 0.055946994291588885], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 84.75, 82, 95, 84.0, 89.4, 95.0, 95.0, 0.10077470554890723, 0.07489213957296718, 0.05058417837122882], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 628.8333333333334, 495, 831, 634.0, 831.0, 831.0, 831.0, 0.03410079056999471, 10.02676468039034, 0.01944810712195011], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 94.62499999999999, 82, 252, 84.0, 138.6000000000001, 252.0, 252.0, 0.10077407083157504, 0.03642480758450851, 0.05694374681144542], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 928.5, 807, 1062, 944.0, 1062.0, 1062.0, 1062.0, 0.034004545274218326, 30.597349611356385, 0.019360009662958283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 195.33333333333334, 82, 254, 249.5, 254.0, 254.0, 254.0, 0.03414834039065701, 0.06042655545690479, 0.01890830957177981], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 106.125, 83, 247, 85.0, 246.3, 247.0, 247.0, 0.07446189645142524, 0.05533740546829552, 0.03737638161721931], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 150.625, 81, 332, 83.5, 280.20000000000005, 332.0, 332.0, 0.07440718401361651, 0.033879247603856154, 0.041654217027153974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 215.06250000000003, 82, 973, 84.0, 971.6, 973.0, 973.0, 0.07416162599364991, 8.35883544520151, 0.04280226656469443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 181.0625, 81, 749, 85.0, 562.8000000000002, 749.0, 749.0, 0.07433044528582379, 2.749482445239367, 0.04297228868086688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 86.83333333333334, 83, 94, 85.5, 94.0, 94.0, 94.0, 0.03417985439382028, 0.025401239446969957, 0.019192789332467444], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 553.5294117647059, 82, 1248, 642.0, 1187.2, 1248.0, 1248.0, 0.09622242095611125, 45.8492594853374, 0.05219049280029885], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 156.5625, 83, 737, 86.0, 395.4000000000003, 737.0, 737.0, 0.10077470554890723, 5.692792886329281, 0.058703234238206205], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 373.88235294117646, 83, 672, 486.0, 669.6, 672.0, 672.0, 0.09622351023365332, 14.990802606666591, 0.052285051889942945], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 151.62499999999997, 83, 662, 84.5, 376.4000000000003, 662.0, 662.0, 0.10077470554890723, 1.8774086532405365, 0.05880164703659381], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f090b324-b6f6-4c98-818b-49b6bf299de1", 1, 0, 0.0, 481.0, 481, 481, 481.0, 481.0, 481.0, 481.0, 2.079002079002079, 0.37560096153846156, 1.4333744802494803], "isController": false}, {"data": ["deleteBooks", 15, 4, 26.666666666666668, 597.7333333333333, 87, 3566, 446.0, 1876.400000000001, 3566.0, 3566.0, 0.0863224893103984, 0.018225509950105603, 0.057874283523338725], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/31b81781-f38f-440a-925b-fd28c7f8d224", 3, 0, 0.0, 1150.0, 220, 2163, 1067.0, 2163.0, 2163.0, 2163.0, 0.019957955240959044, 0.027513652488757017, 0.012798558536682722], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 368.9375, 168, 1219, 260.0, 1107.0, 1219.0, 1219.0, 0.07412623698157962, 11.185614775791297, 0.16434090772210072], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f090b324-b6f6-4c98-818b-49b6bf299de1", 3, 0, 0.0, 325.3333333333333, 208, 513, 255.0, 513.0, 513.0, 513.0, 0.05860176195964292, 0.03836202581407615, 0.03757990594417206], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 733.952380952381, 154, 2682, 508.0, 1344.4, 2550.399999999998, 2682.0, 0.10152087946087579, 0.06235999334071374, 0.04590250702186083], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 85.35294117647061, 83, 94, 85.0, 90.8, 94.0, 94.0, 0.09622242095611125, 0.07150904526132877, 0.048299144893985534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 143.47058823529412, 82, 261, 85.0, 257.8, 261.0, 261.0, 0.09622242095611125, 0.10225843219715408, 0.05059857774771613], "isController": false}, {"data": ["login", 21, 0, 0.0, 2808.47619047619, 1735, 4571, 2546.0, 4139.400000000001, 4532.099999999999, 4571.0, 0.10183200628448953, 34.94605100934915, 0.20188820330760054], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a357932e-1de9-468b-9c64-5f4b47037f80", 1, 0, 0.0, 3566.0, 3566, 3566, 3566.0, 3566.0, 3566.0, 3566.0, 0.28042624789680315, 0.05066294517666854, 0.1933407529444756], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 91.25, 85, 108, 89.5, 103.80000000000001, 108.0, 108.0, 0.0981047390720518, 0.07942268426829194, 0.03487316896701841], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 651.2941176470589, 168, 1334, 749.0, 1273.2, 1334.0, 1334.0, 0.09617614944642139, 60.984319574958, 0.20327487744612724], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/702744c9-8716-4fdb-b793-24c73b094009", 3, 0, 0.0, 406.0, 186, 639, 393.0, 639.0, 639.0, 639.0, 0.021757892675568064, 0.025717092547196497, 0.013952815289996446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 301.19999999999993, 169, 990, 330.0, 413.90000000000015, 961.5499999999996, 990.0, 0.09172670944188883, 5.621902252865313, 0.20512206245213013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 8, 57.142857142857146, 496.8571428571429, 83, 1150, 166.5, 1116.0, 1150.0, 1150.0, 0.0697711506259469, 35.783762072900885, 0.09384258693983732], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=33edac9e-e8d7-4d3e-8586-8631e639f3f4", 1, 0, 0.0, 642.0, 642, 642, 642.0, 642.0, 642.0, 642.0, 1.557632398753894, 0.2814081970404984, 1.0739145249221183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2209d3f0-81b0-4d58-9d9c-db00fb74383a", 3, 0, 0.0, 389.6666666666667, 173, 604, 392.0, 604.0, 604.0, 604.0, 0.11064802862095674, 0.050065351491904254, 0.07095592981226718], "isController": false}, {"data": ["register", 24, 8, 33.333333333333336, 1015.7083333333333, 325, 1833, 980.0, 1695.0, 1822.0, 1833.0, 0.09305463470239964, 0.029079573344499888, 0.041983634016121714], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7646f878-abfb-47c3-b7aa-1b3f98bb2825", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.3214663033807829, 1.2267849199288254], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a55d43eb-1a13-42f2-9b5a-032659b745a7", 1, 0, 0.0, 496.0, 496, 496, 496.0, 496.0, 496.0, 496.0, 2.0161290322580645, 0.6438224546370968, 1.2029832409274193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 119.88235294117648, 86, 434, 89.0, 309.1999999999999, 434.0, 434.0, 0.08768084173608068, 0.06807252849627357, 0.031167799210872427], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 263.5, 169, 823, 174.5, 483.50000000000034, 823.0, 823.0, 0.10072078310408863, 7.677408495561991, 0.22491275455604168], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f71ec898-3fa2-4305-b257-0d0995288779", 3, 0, 0.0, 278.0, 181, 396, 257.0, 396.0, 396.0, 396.0, 0.044588448619244374, 0.028927336620492853, 0.02859350383460658], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cea0fda2-ec5d-420d-8221-0d189b8c4095", 1, 0, 0.0, 399.0, 399, 399, 399.0, 399.0, 399.0, 399.0, 2.506265664160401, 0.45279213659147866, 1.727952694235589], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=31b81781-f38f-440a-925b-fd28c7f8d224", 1, 0, 0.0, 750.0, 750, 750, 750.0, 750.0, 750.0, 750.0, 1.3333333333333333, 0.24088541666666666, 0.9192708333333334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 13, 0, 0.0, 349.38461538461536, 169, 839, 336.0, 640.5999999999998, 839.0, 839.0, 0.10500044423264868, 9.813061348528782, 0.23408189479359337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 149.42857142857142, 81, 353, 86.0, 353.0, 353.0, 353.0, 0.04266367614612918, 0.031706110885941705, 0.0214151655655375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 107.14285714285715, 82, 248, 84.0, 248.0, 248.0, 248.0, 0.042733999169739446, 0.011434683371590437, 0.024371733901492026], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 130.28571428571428, 83, 249, 83.0, 249.0, 249.0, 249.0, 0.042733999169739446, 0.011518148213718835, 0.025122917480647603], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 131.0, 81, 252, 84.0, 252.0, 252.0, 252.0, 0.04273321652920815, 0.011517937267638136, 0.025164189030383317], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, 100.0, 87.75, 87, 89, 87.5, 89.0, 89.0, 89.0, 0.029088158937700438, 0.00857873437420462, 0.017981254499574585], "isController": false}, {"data": ["https://demoqa.com/books", 53, 0, 0.0, 964.3396226415094, 655, 1618, 916.0, 1383.2, 1415.3999999999999, 1618.0, 0.22696031620282545, 271.5234423510091, 0.44815796812706354], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, 33.333333333333336, 1015.7083333333333, 325, 1833, 980.0, 1695.0, 1822.0, 1833.0, 0.09473023591775837, 0.02960319872429949, 0.04273961815820739], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 131.57142857142858, 82, 250, 86.0, 250.0, 250.0, 250.0, 0.03745378470494444, 0.010094965408754555, 0.022055304860431148], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 85.14285714285715, 82, 90, 85.0, 90.0, 90.0, 90.0, 0.03745378470494444, 0.010094965408754555, 0.022018728898805226], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/30f613ff-66b1-4090-ae8f-a95b1829648c", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 1.1323969414893618, 2.115885416666667], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 171.05882352941177, 82, 890, 84.0, 384.3999999999995, 890.0, 890.0, 0.08631720047931433, 4.590624214576944, 0.05030872679590551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 136.8823529411765, 81, 487, 84.0, 306.1999999999998, 487.0, 487.0, 0.08631720047931433, 1.5148450511048601, 0.050393020936998593], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 95.11764705882354, 81, 251, 85.0, 127.7999999999999, 251.0, 251.0, 0.08631500916462304, 0.06414621286550598, 0.04332608858458617], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 108.85714285714285, 84, 248, 85.0, 248.0, 248.0, 248.0, 0.03745358430801828, 0.010021759863668954, 0.021360247300666674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 113.70588235294117, 83, 254, 84.0, 252.4, 254.0, 254.0, 0.08631720047931433, 0.030722735188983892, 0.048801349214005724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 85.42857142857143, 84, 87, 85.0, 87.0, 87.0, 87.0, 0.03745358430801828, 0.027834157869533114, 0.018799943685860736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 94.0, 88, 116, 90.0, 116.0, 116.0, 116.0, 0.03719210252268718, 0.029274252571568234, 0.01322063019361146], "isController": false}, {"data": ["deleteAccount", 15, 4, 26.666666666666668, 486.46666666666664, 83, 2163, 396.0, 1339.2000000000005, 2163.0, 2163.0, 0.08571428571428572, 0.017472098214285713, 0.0583203125], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1498.2857142857144, 786, 2766, 1440.0, 1819.8, 2671.4999999999986, 2766.0, 0.09980087349526422, 0.051654748977041046, 0.04590450333620063], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 219.42857142857142, 170, 338, 175.0, 338.0, 338.0, 338.0, 0.03743635819107517, 0.05801904340745732, 0.08419524698637317], "isController": false}, {"data": ["addBook", 60, 12, 20.0, 913.8166666666668, 431, 2046, 729.0, 1602.4, 1760.3999999999996, 2046.0, 0.2751561511157582, 83.37039253174615, 1.0002983007961186], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b647da5c-83ee-4365-9257-56f5619268f5", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/books-0", 53, 0, 0.0, 157.62264150943395, 83, 651, 86.0, 337.6, 340.6, 651.0, 0.22776106574989255, 0.16926383890201976, 0.11009934330683284], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c4545831-2c37-4853-a0b1-da32a9eb60f0", 1, 0, 0.0, 606.0, 606, 606, 606.0, 606.0, 606.0, 606.0, 1.6501650165016502, 0.29812551567656764, 1.1377114273927393], "isController": false}, {"data": ["https://demoqa.com/books-3", 53, 0, 0.0, 538.4528301886792, 406, 829, 496.0, 684.2, 748.1999999999999, 829.0, 0.2277933699235388, 66.97881420925614, 0.11456404835021726], "isController": false}, {"data": ["https://demoqa.com/books-1", 53, 0, 0.0, 142.28301886792448, 82, 334, 89.0, 254.8, 280.8999999999998, 334.0, 0.22818468321077376, 0.4037799277128145, 0.11097262913961459], "isController": false}, {"data": ["https://demoqa.com/books-2", 53, 0, 0.0, 804.9811320754716, 569, 1531, 802.0, 1044.8, 1071.5, 1531.0, 0.2276270524014654, 204.81922187651662, 0.11425811028745432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 13, 0, 0.0, 94.07692307692308, 84, 118, 90.0, 117.2, 118.0, 118.0, 0.10293849820649462, 0.07690229602340663, 0.036591419284339885], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 12, 6.936416184971098, 157.10982658959534, 84, 1533, 91.0, 289.19999999999993, 361.89999999999964, 1158.5599999999954, 0.7127818681477147, 1.4987362156020947, 0.3444409580735937], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 94.0, 86, 123, 87.0, 123.0, 123.0, 123.0, 0.04421424962102072, 0.03424013666940374, 0.015716784044972208], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c4545831-2c37-4853-a0b1-da32a9eb60f0", 3, 0, 0.0, 354.0, 303, 441, 318.0, 441.0, 441.0, 441.0, 0.022966507177033493, 0.027145633971291865, 0.01472787081339713], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 100.14999999999998, 85, 256, 89.5, 112.10000000000002, 248.8499999999999, 256.0, 0.0973354422679158, 0.07898999269984183, 0.0345997079936732], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 305.71428571428567, 168, 606, 171.0, 606.0, 606.0, 606.0, 0.042641065782981345, 0.06608532363046034, 0.09590075634590432], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/33edac9e-e8d7-4d3e-8586-8631e639f3f4", 3, 0, 0.0, 279.0, 197, 417, 223.0, 417.0, 417.0, 417.0, 0.0390335298021, 0.025094798619514164, 0.025031267483768556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 278.3529411764706, 169, 988, 171.0, 605.5999999999997, 988.0, 988.0, 0.08627777383042864, 6.1975077459677825, 0.19274220740415554], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a357932e-1de9-468b-9c64-5f4b47037f80", 3, 0, 0.0, 986.3333333333333, 184, 2319, 456.0, 2319.0, 2319.0, 2319.0, 0.028797972622727357, 0.028882341683145504, 0.018467449891527637], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 92.75, 86, 108, 92.0, 102.4, 108.0, 108.0, 0.07343020000550726, 0.06088109355925358, 0.02610214140820766], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=702744c9-8716-4fdb-b793-24c73b094009", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 558.0, 1.7921146953405018, 0.32377072132616486, 1.2355790770609318], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 98.11764705882354, 85, 254, 88.0, 128.3999999999999, 254.0, 254.0, 0.09901278429773726, 0.07687027687177844, 0.03519595066833629], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7646f878-abfb-47c3-b7aa-1b3f98bb2825", 3, 0, 0.0, 399.0, 303, 524, 370.0, 524.0, 524.0, 524.0, 0.03017713981068874, 0.03026554939997787, 0.01935187676662006], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b0f4089-084b-4893-b0eb-2d920f2e37b6", 2, 0, 0.0, 189.0, 187, 191, 189.0, 191.0, 191.0, 191.0, 0.019822194911642565, 0.028223398614428574, 0.0123211201770122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 13, 0, 0.0, 84.46153846153847, 83, 88, 84.0, 87.6, 88.0, 88.0, 0.10521459731136237, 0.07819170757221364, 0.052812795916054936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 13, 0, 0.0, 211.15384615384616, 84, 257, 247.0, 256.6, 257.0, 257.0, 0.10507343016254052, 0.0402549950292185, 0.05924588091947334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 13, 0, 0.0, 186.30769230769232, 82, 752, 85.0, 553.5999999999998, 752.0, 752.0, 0.10521715201450377, 7.308837696978649, 0.06116063118150768], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2209d3f0-81b0-4d58-9d9c-db00fb74383a", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 0.91244476010101, 3.4820864898989896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 13, 0, 0.0, 178.0, 82, 498, 85.0, 399.19999999999993, 498.0, 498.0, 0.10507597801487228, 2.4027447310459102, 0.061181182811994826], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 22.22222222222222, 0.6211180124223602], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 4, 11.11111111111111, 0.3105590062111801], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 4, 11.11111111111111, 0.3105590062111801], "isController": false}, {"data": ["401/Unauthorized", 20, 55.55555555555556, 1.5527950310559007], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1288, 36, "401/Unauthorized", 20, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 8, "Test failed: code expected to contain /200/", 4, "Test failed: code expected to contain /204/", 4, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 4, 4, "401/Unauthorized", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 24, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 12, "401/Unauthorized", 12, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
