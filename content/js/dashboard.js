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

    var data = {"OkPercent": 98.45201238390094, "KoPercent": 1.5479876160990713};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7425049966688874, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/05c79bb1-5cb7-42dd-9096-4387ca637706"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=cec59c1a-fd7d-4a9f-942c-b99489667069"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6433c9dd-bfde-48b6-a900-0c4852eef7b1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=32681fea-d690-4ace-af20-83143f88cd17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d1c2e5f8-154e-436f-bf7b-c41f82d93ecc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8214285714285714, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6590909090909091, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc331acc-e3d2-498e-90fd-8bcce692fd4b"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=23baa827-cde0-4a19-840c-a27a7f178e36"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f403ba6a-4279-4e96-8c6b-a0b540a1a036"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f351b7ff-8b9f-493d-b8a0-673b1fbde338"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eba65ccc-3dfa-415d-a086-9be76275c355"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=546f5583-da0e-424a-8ecb-70a1a22bdc5a"], "isController": false}, {"data": [0.5625, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f4f72c4-89f2-408f-842d-8d6125aba22c"], "isController": false}, {"data": [0.6785714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.0625, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1d9ed39d-53cf-4397-9e7d-cbe578d41984"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "register"], "isController": true}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.24107142857142858, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.2727272727272727, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5b4ee5c8-15d8-4520-85c8-481eb5aaa458"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/23baa827-cde0-4a19-840c-a27a7f178e36"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c2fbd494-0a15-420c-851c-921643876e2a"], "isController": false}, {"data": [0.2719298245614035, 500, 1500, "addBook"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.45535714285714285, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1c2e5f8-154e-436f-bf7b-c41f82d93ecc"], "isController": false}, {"data": [0.9910714285714286, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6433c9dd-bfde-48b6-a900-0c4852eef7b1"], "isController": false}, {"data": [0.38392857142857145, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9264705882352942, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=05c79bb1-5cb7-42dd-9096-4387ca637706"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/32681fea-d690-4ace-af20-83143f88cd17"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bc331acc-e3d2-498e-90fd-8bcce692fd4b"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/eba65ccc-3dfa-415d-a086-9be76275c355"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5b4ee5c8-15d8-4520-85c8-481eb5aaa458"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c2fbd494-0a15-420c-851c-921643876e2a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/73ca6724-4b04-4341-a499-9dd684d9d274"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/cec59c1a-fd7d-4a9f-942c-b99489667069"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f4f72c4-89f2-408f-842d-8d6125aba22c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/546f5583-da0e-424a-8ecb-70a1a22bdc5a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1292, 20, 1.5479876160990713, 469.46904024767804, 117, 3832, 141.0, 1363.9000000000003, 1625.0499999999997, 2529.0, 5.144786722308942, 736.9844760440891, 3.7621540670992486], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2296.1607142857147, 1556, 4249, 2198.0, 3062.3, 3910.6499999999996, 4249.0, 0.256022237360045, 308.08028129443244, 1.258859340925612], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/05c79bb1-5cb7-42dd-9096-4387ca637706", 3, 0, 0.0, 416.6666666666667, 282, 530, 438.0, 530.0, 530.0, 530.0, 0.05779678649867068, 0.026151540766000077, 0.037063694466920975], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=cec59c1a-fd7d-4a9f-942c-b99489667069", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["deleteBook", 13, 1, 7.6923076923076925, 683.3076923076923, 142, 1806, 598.0, 1431.9999999999995, 1806.0, 1806.0, 0.08249830243877673, 0.015629561204221373, 0.05576939780998737], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, 7.6923076923076925, 683.3076923076923, 142, 1806, 598.0, 1431.9999999999995, 1806.0, 1806.0, 0.08149244000902685, 0.015438997423585166, 0.055089428158145486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 159.28571428571428, 121, 374, 125.0, 368.5, 374.0, 374.0, 0.09255831173639394, 0.044626328872904214, 0.05167666902469985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 168.7142857142857, 121, 457, 127.5, 415.0, 457.0, 457.0, 0.09254546295867845, 0.06877646221831475, 0.046453484336680395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 334.0, 121, 988, 243.0, 971.0, 988.0, 988.0, 0.09255525218000675, 3.909142351630625, 0.0533664700418482], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 404.71428571428567, 120, 1753, 127.5, 1588.0, 1753.0, 1753.0, 0.09255586407510247, 11.918801339580854, 0.05327643626867645], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 391.53846153846155, 127, 1608, 275.0, 1156.7999999999997, 1608.0, 1608.0, 0.08251244033715853, 0.16897942822052403, 0.053336805070706816], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/6433c9dd-bfde-48b6-a900-0c4852eef7b1", 3, 0, 0.0, 903.0, 258, 1977, 474.0, 1977.0, 1977.0, 1977.0, 0.03365870077415012, 0.028059873920116683, 0.021584518400089757], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=32681fea-d690-4ace-af20-83143f88cd17", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 126.66666666666667, 121, 136, 127.0, 133.0, 136.0, 136.0, 0.0803892985765735, 0.05974243771169181, 0.04035165963706911], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1c2e5f8-154e-436f-bf7b-c41f82d93ecc", 3, 0, 0.0, 472.3333333333333, 458, 480, 479.0, 480.0, 480.0, 480.0, 0.08663259118080222, 0.039198991452251, 0.055555405151751426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 156.73333333333332, 119, 375, 125.0, 369.0, 375.0, 375.0, 0.08039188363542817, 0.02151110948838605, 0.04584849613583012], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 935.0, 754, 1113, 978.0, 1113.0, 1113.0, 1113.0, 0.04978261591052405, 14.637742016112973, 0.028391648136470743], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 1565.6666666666667, 1367, 1743, 1553.5, 1743.0, 1743.0, 1743.0, 0.04959948416536468, 44.6297030385884, 0.028238768816804306], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 214.83333333333331, 121, 441, 122.5, 441.0, 441.0, 441.0, 0.05014919385170883, 0.08874056568290664, 0.027768157142498934], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 144.14285714285714, 121, 388, 126.5, 258.5, 388.0, 388.0, 0.06902127827407364, 0.05129413356110355, 0.03464544632116587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 196.28571428571425, 119, 384, 126.0, 381.0, 384.0, 384.0, 0.06893461551718195, 0.025840863824590946, 0.03890074215499456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 300.14285714285717, 118, 1495, 126.5, 988.0, 1495.0, 1495.0, 0.06890001131928757, 4.445555034191631, 0.04008273537966367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 220.99999999999997, 119, 999, 127.0, 683.0, 999.0, 999.0, 0.06902195884319197, 1.4668995798288256, 0.04022108288058215], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 124.16666666666666, 122, 128, 124.0, 128.0, 128.0, 128.0, 0.05014919385170883, 0.037269078633935956, 0.02815994771946541], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 920.2499999999997, 123, 1627, 1256.0, 1533.2, 1627.0, 1627.0, 0.09489579255779747, 53.376717113418266, 0.05069140481358908], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 140.26666666666668, 121, 361, 125.0, 223.60000000000008, 361.0, 361.0, 0.08039188363542817, 0.021668124886111497, 0.04726163471535914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 659.875, 121, 1120, 949.5, 1114.4, 1120.0, 1120.0, 0.09489916963226572, 17.449283622479243, 0.050785883748517203], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 141.33333333333331, 119, 373, 125.0, 230.2000000000001, 373.0, 373.0, 0.08039360710036338, 0.02166858941376982, 0.047341157306171014], "isController": false}, {"data": ["deleteBooks", 13, 1, 7.6923076923076925, 547.2307692307692, 127, 1300, 463.0, 1169.6, 1300.0, 1300.0, 0.08163675412265609, 0.01546633818339383, 0.055837037731879785], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 464.50000000000006, 247, 1622, 256.5, 1194.0, 1622.0, 1622.0, 0.06885765156060948, 5.983214064605691, 0.1536040525187145], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 670.4545454545453, 141, 1538, 584.0, 1449.4999999999998, 1535.75, 1538.0, 0.09592786224758981, 0.058924438822005855, 0.043373633027962974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 127.24999999999999, 122, 140, 126.5, 136.5, 140.0, 140.0, 0.09489804391406982, 0.07052481583848352, 0.047634369699054574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 186.75, 119, 378, 126.5, 377.3, 378.0, 378.0, 0.09489635538685093, 0.11447336229649181, 0.04913944574597432], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc331acc-e3d2-498e-90fd-8bcce692fd4b", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["login", 22, 0, 0.0, 3245.181818181818, 1939, 5343, 3349.0, 4569.099999999999, 5235.5999999999985, 5343.0, 0.09648614985176218, 31.612791007161903, 0.18921187536182307], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 145.06666666666666, 124, 355, 129.0, 232.00000000000006, 355.0, 355.0, 0.07897896000505467, 0.0639390213322171, 0.028074552189296772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=23baa827-cde0-4a19-840c-a27a7f178e36", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.4406440548780488, 1.681592987804878], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f403ba6a-4279-4e96-8c6b-a0b540a1a036", 1, 0, 0.0, 280.0, 280, 280, 280.0, 280.0, 280.0, 280.0, 3.571428571428571, 1.1404854910714284, 2.130998883928571], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f351b7ff-8b9f-493d-b8a0-673b1fbde338", 1, 0, 0.0, 269.0, 269, 269, 269.0, 269.0, 269.0, 269.0, 3.717472118959108, 1.1871224442379182, 2.218140102230483], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eba65ccc-3dfa-415d-a086-9be76275c355", 1, 0, 0.0, 514.0, 514, 514, 514.0, 514.0, 514.0, 514.0, 1.9455252918287937, 0.3514865029182879, 1.3413484922178989], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=546f5583-da0e-424a-8ecb-70a1a22bdc5a", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 1050.6250000000002, 251, 1755, 1384.0, 1663.3000000000002, 1755.0, 1755.0, 0.09482661546029432, 70.95861049745449, 0.1981033565658541], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0f4f72c4-89f2-408f-842d-8d6125aba22c", 3, 0, 0.0, 349.0, 230, 494, 323.0, 494.0, 494.0, 494.0, 0.02431098613463424, 0.024382209726825553, 0.015590052957431464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 627.9999999999999, 250, 1877, 500.0, 1714.0, 1877.0, 1877.0, 0.09246783440331827, 15.92621706659005, 0.2045825035996407], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, 25.0, 1299.125, 125, 1868, 1580.5, 1868.0, 1868.0, 1868.0, 0.0660660164669546, 59.2828624237144, 0.12267214068345295], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1d9ed39d-53cf-4397-9e7d-cbe578d41984", 1, 0, 0.0, 449.0, 449, 449, 449.0, 449.0, 449.0, 449.0, 2.2271714922048997, 0.7112158964365256, 1.3289079899777283], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1227.4545454545455, 473, 3006, 1069.5, 2218.6, 2889.5999999999985, 3006.0, 0.09661199306150232, 0.030397097248753925, 0.04358861405704499], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 318.40000000000003, 244, 502, 257.0, 501.4, 502.0, 502.0, 0.08033505071819536, 0.1245036381736094, 0.18067541191797257], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 158.83333333333331, 124, 384, 131.0, 367.8, 384.0, 384.0, 0.11114541525162087, 0.08628965344242051, 0.03950872182772461], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 345.5263157894737, 243, 511, 257.0, 510.0, 511.0, 511.0, 0.09133298082007403, 0.14154828179829831, 0.20541001448108445], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 172.25, 120, 377, 126.0, 376.1, 377.0, 377.0, 0.05649212170286086, 0.04198291466394249, 0.028356397026631328], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 145.83333333333334, 117, 351, 126.0, 289.8000000000002, 351.0, 351.0, 0.056492387650764066, 0.015116127164364602, 0.03221831483207638], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 187.91666666666666, 120, 381, 127.0, 380.4, 381.0, 381.0, 0.05642465193042841, 0.015208206965623281, 0.03317152388878701], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 164.66666666666663, 118, 383, 122.5, 378.8, 383.0, 383.0, 0.05649424935620095, 0.015226965646788538, 0.033267609728309736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, 100.0, 127.0, 127, 127, 127.0, 127.0, 127.0, 127.0, 7.874015748031496, 2.3222194881889764, 4.867433562992126], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1651.6607142857138, 1001, 3723, 1510.5, 2493.3, 2974.049999999999, 3723.0, 0.2542207453207494, 304.1363928346067, 0.5019866670298392], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1227.4545454545455, 473, 3006, 1069.5, 2218.6, 2889.5999999999985, 3006.0, 0.096956021630007, 0.030505339191827487, 0.04374383007135082], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 5, 0, 0.0, 126.0, 125, 127, 126.0, 127.0, 127.0, 127.0, 0.041589033803566676, 0.01120954426736758, 0.024490417366748736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 5, 0, 0.0, 123.0, 117, 127, 123.0, 127.0, 127.0, 127.0, 0.041590071618103325, 0.011209823990816912, 0.024450413197361524], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 440.0, 121, 2973, 127.0, 1856.1000000000017, 2973.0, 2973.0, 0.10820168794633196, 10.843708766891487, 0.06257758211305875], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 257.44444444444446, 118, 1000, 126.0, 939.7, 1000.0, 1000.0, 0.10820233837275706, 3.5609323810525684, 0.06268362462805446], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 5, 0, 0.0, 124.4, 119, 128, 125.0, 128.0, 128.0, 128.0, 0.04158937973599062, 0.011128408249669364, 0.02371894313068215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 170.83333333333334, 124, 384, 128.0, 377.7, 384.0, 384.0, 0.10820038711694056, 0.08041063925389821, 0.05431152243955806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 5, 0, 0.0, 125.6, 119, 128, 127.0, 128.0, 128.0, 128.0, 0.04158868787689748, 0.030907218236639635, 0.020875571844458308], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 204.7222222222222, 120, 375, 126.0, 373.2, 375.0, 375.0, 0.1082049401566567, 0.04701091367049191, 0.0607009050140967], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 5, 0, 0.0, 224.6, 129, 372, 136.0, 372.0, 372.0, 372.0, 0.041281033016570205, 0.03249268809702694, 0.01467411720510894], "isController": false}, {"data": ["deleteAccount", 13, 1, 7.6923076923076925, 602.6153846153845, 125, 1257, 493.0, 1214.2, 1257.0, 1257.0, 0.08145312372729493, 0.015260223150230888, 0.05543609532521726], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5b4ee5c8-15d8-4520-85c8-481eb5aaa458", 1, 0, 0.0, 783.0, 783, 783, 783.0, 783.0, 783.0, 783.0, 1.277139208173691, 0.2307331577266922, 0.8805276181353767], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1599.4090909090912, 997, 3832, 1442.0, 2295.7, 3618.2499999999973, 3832.0, 0.09634122309561866, 0.049864109610037004, 0.04431319929495742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 5, 0, 0.0, 252.6, 245, 255, 254.0, 255.0, 255.0, 255.0, 0.04154514711136592, 0.06438686373607198, 0.09343600956784738], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/23baa827-cde0-4a19-840c-a27a7f178e36", 3, 0, 0.0, 798.0, 297, 1473, 624.0, 1473.0, 1473.0, 1473.0, 0.017473963793947018, 0.02065363363796277, 0.011205634334008993], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c2fbd494-0a15-420c-851c-921643876e2a", 1, 0, 0.0, 974.0, 974, 974, 974.0, 974.0, 974.0, 974.0, 1.026694045174538, 0.18548671714579057, 0.7078574178644764], "isController": false}, {"data": ["addBook", 57, 10, 17.54385964912281, 1305.7017543859652, 643, 3626, 1034.0, 2363.2, 2509.3, 3626.0, 0.2746683500142153, 87.56175049723404, 0.9975880309050081], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 216.12499999999997, 119, 515, 128.0, 505.3, 510.6, 515.0, 0.255861980737248, 0.19014742904398999, 0.12368328170404079], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 894.0892857142854, 581, 2350, 744.5, 1368.7000000000019, 1750.0, 2350.0, 0.25569375194053295, 75.18245290212408, 0.12859597875915474], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1c2e5f8-154e-436f-bf7b-c41f82d93ecc", 1, 0, 0.0, 211.0, 211, 211, 211.0, 211.0, 211.0, 211.0, 4.739336492890995, 0.8562277843601896, 3.267550355450237], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 199.1785714285714, 118, 512, 129.0, 380.0, 384.2, 512.0, 0.25635978264352716, 0.45363664663092884, 0.12467497241843409], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6433c9dd-bfde-48b6-a900-0c4852eef7b1", 1, 0, 0.0, 656.0, 656, 656, 656.0, 656.0, 656.0, 656.0, 1.524390243902439, 0.2754025342987805, 1.0509956173780488], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1397.6249999999995, 872, 3595, 1346.5, 1784.6000000000006, 2847.749999999999, 3595.0, 0.2548617147642302, 229.32501894396228, 0.12792863416876396], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 132.31578947368425, 128, 156, 130.0, 140.0, 156.0, 156.0, 0.09448035803083044, 0.07058347059920438, 0.03358481476877176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 10, 5.882352941176471, 192.22941176470584, 120, 1048, 132.0, 366.70000000000005, 453.79999999999995, 737.7299999999965, 0.7155363997575594, 1.583814829702337, 0.3423049189970705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 171.0, 125, 384, 130.0, 381.6, 384.0, 384.0, 0.05699115212363281, 0.04413474964261799, 0.0202585736064476], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=05c79bb1-5cb7-42dd-9096-4387ca637706", 1, 0, 0.0, 307.0, 307, 307, 307.0, 307.0, 307.0, 307.0, 3.257328990228013, 0.5884822882736156, 2.2457756514657983], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/32681fea-d690-4ace-af20-83143f88cd17", 3, 0, 0.0, 368.0, 242, 493, 369.0, 493.0, 493.0, 493.0, 0.023069115068745965, 0.023136700366798928, 0.014793670796038263], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 151.57142857142856, 123, 369, 131.0, 262.0, 369.0, 369.0, 0.09276191990670801, 0.07527847211179137, 0.03297396371683761], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc331acc-e3d2-498e-90fd-8bcce692fd4b", 3, 0, 0.0, 394.3333333333333, 275, 609, 299.0, 609.0, 609.0, 609.0, 0.055062036561192275, 0.03539958405219881, 0.03530996485206666], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 382.49999999999994, 246, 757, 257.0, 754.0, 757.0, 757.0, 0.056390977443609026, 0.08739500117481203, 0.1268246299342105], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eba65ccc-3dfa-415d-a086-9be76275c355", 3, 0, 0.0, 644.6666666666666, 262, 1150, 522.0, 1150.0, 1150.0, 1150.0, 0.023375955492180744, 0.023444439736786744, 0.014990440208201845], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 639.9444444444445, 250, 3098, 378.5, 1982.9000000000017, 3098.0, 3098.0, 0.10811719904376343, 14.520693556815589, 0.24008447031582236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5b4ee5c8-15d8-4520-85c8-481eb5aaa458", 3, 0, 0.0, 425.66666666666663, 219, 828, 230.0, 828.0, 828.0, 828.0, 0.03980257920713262, 0.02558922328583559, 0.02552444044207398], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c2fbd494-0a15-420c-851c-921643876e2a", 3, 0, 0.0, 689.3333333333333, 379, 1257, 432.0, 1257.0, 1257.0, 1257.0, 0.02689425180191487, 0.02714813634040951, 0.017246639339118585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 147.28571428571428, 123, 357, 131.0, 249.5, 357.0, 357.0, 0.06791863347709444, 0.05631144513872381, 0.024142951743810915], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 132.0, 124, 141, 132.5, 137.5, 141.0, 141.0, 0.0937701459297896, 0.07280006446697533, 0.0333323565609799], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73ca6724-4b04-4341-a499-9dd684d9d274", 1, 0, 0.0, 332.0, 332, 332, 332.0, 332.0, 332.0, 332.0, 3.0120481927710845, 0.9618552334337349, 1.7972279743975903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 126.6842105263158, 121, 135, 127.0, 135.0, 135.0, 135.0, 0.09149747659590862, 0.06799763641551412, 0.045927444306930694], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cec59c1a-fd7d-4a9f-942c-b99489667069", 3, 0, 0.0, 1069.0, 240, 2529, 438.0, 2529.0, 2529.0, 2529.0, 0.021493820526598602, 0.02540496820705714, 0.013783472147590903], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 175.9473684210526, 118, 379, 125.0, 376.0, 379.0, 379.0, 0.09150276434667026, 0.02448413811619888, 0.05218517029146038], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f4f72c4-89f2-408f-842d-8d6125aba22c", 1, 0, 0.0, 1300.0, 1300, 1300, 1300.0, 1300.0, 1300.0, 1300.0, 0.7692307692307693, 0.13897235576923075, 0.5303485576923077], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 163.05263157894737, 119, 373, 126.0, 366.0, 373.0, 373.0, 0.09139097057210747, 0.024632722537013343, 0.05372789480899287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/546f5583-da0e-424a-8ecb-70a1a22bdc5a", 3, 0, 0.0, 1022.6666666666667, 446, 1608, 1014.0, 1608.0, 1608.0, 1608.0, 0.0171933564870534, 0.02370242992274452, 0.011025687590981511], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 163.78947368421055, 119, 384, 126.0, 375.0, 384.0, 384.0, 0.09149879847630422, 0.024661785526816374, 0.05388064011837055], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 30.0, 0.46439628482972134], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 5.0, 0.07739938080495357], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 1, 5.0, 0.07739938080495357], "isController": false}, {"data": ["401/Unauthorized", 12, 60.0, 0.9287925696594427], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1292, 20, "401/Unauthorized", 12, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 2, "Test failed: code expected to contain /200/", 1, "Test failed: code expected to contain /204/", 1, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 1, 1, "401/Unauthorized", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
