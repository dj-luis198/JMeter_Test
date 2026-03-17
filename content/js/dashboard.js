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

    var data = {"OkPercent": 98.09160305343511, "KoPercent": 1.9083969465648856};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7635224274406333, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.02586206896551724, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4096220c-1739-43a5-bd7c-df8a0922d37e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/80a22d86-9d98-4908-bb2e-de32c505e635"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e080ecb0-a605-48d4-ae95-ce09904deaff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d7d363af-98eb-4c32-848f-b73b38bf7b69"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2ead02df-a14d-4e61-8b07-ba6d47ad2fc1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/57b134b0-ce88-4723-94cc-be8d15abf68b"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7fef4466-ff16-4bdd-9bbf-901782ea2e9e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fc36d380-ee45-474b-b70e-41aa9e03711e"], "isController": false}, {"data": [0.675, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/cf839e1b-121c-446f-9ff0-ec2daf13a3a2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0e0753a8-9a9a-4959-8919-55f0751b52bb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e0a9e64d-cb78-48d2-b918-b24eae8cb147"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=20be611d-881d-4462-b151-64d8e00d5f9c"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.2777777777777778, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.8611111111111112, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=80a22d86-9d98-4908-bb2e-de32c505e635"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d7d363af-98eb-4c32-848f-b73b38bf7b69"], "isController": false}, {"data": [0.43103448275862066, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/73cf53e8-57b1-4fc1-af62-acb08fee04a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/53cc4305-2a52-4e43-8f26-b22050420cf2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=27ac826f-582c-4476-9529-a7a8863d4894"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.275, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.28448275862068967, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=57b134b0-ce88-4723-94cc-be8d15abf68b"], "isController": false}, {"data": [0.9396551724137931, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.49137931034482757, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.9913793103448276, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9195402298850575, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2ead02df-a14d-4e61-8b07-ba6d47ad2fc1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/20be611d-881d-4462-b151-64d8e00d5f9c"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc36d380-ee45-474b-b70e-41aa9e03711e"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/27ac826f-582c-4476-9529-a7a8863d4894"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0e0753a8-9a9a-4959-8919-55f0751b52bb"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e080ecb0-a605-48d4-ae95-ce09904deaff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4096220c-1739-43a5-bd7c-df8a0922d37e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1310, 25, 1.9083969465648856, 428.2801526717554, 1, 19837, 135.0, 1002.0, 1201.45, 2127.0500000000147, 5.143346237504809, 736.1234095134237, 3.7617505891781637], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 58, 1, 1.7241379310344827, 2007.189655172414, 1416, 7192, 1773.0, 2225.9, 4801.399999999999, 7192.0, 0.2530077385470376, 304.4603246787238, 1.2414683159608624], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/4096220c-1739-43a5-bd7c-df8a0922d37e", 3, 0, 0.0, 347.3333333333333, 215, 446, 381.0, 446.0, 446.0, 446.0, 0.027648750276487503, 0.02304962547463688, 0.01773048113433606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/80a22d86-9d98-4908-bb2e-de32c505e635", 3, 0, 0.0, 360.66666666666663, 212, 623, 247.0, 623.0, 623.0, 623.0, 0.034611657206147034, 0.028854314487285985, 0.022195626528681525], "isController": false}, {"data": ["deleteBook", 12, 2, 16.666666666666668, 516.8333333333333, 127, 835, 507.5, 834.1, 835.0, 835.0, 0.09318940747068416, 0.018610579909916904, 0.06259646559757708], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, 16.666666666666668, 516.8333333333333, 127, 835, 507.5, 834.1, 835.0, 835.0, 0.09256902177686238, 0.018486684524773783, 0.062179744933774574], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 189.26315789473685, 124, 380, 126.0, 373.0, 380.0, 380.0, 0.10769692950385724, 0.04584426244608068, 0.06046881465358433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e080ecb0-a605-48d4-ae95-ce09904deaff", 3, 0, 0.0, 561.0, 210, 1047, 426.0, 1047.0, 1047.0, 1047.0, 0.027557572361592092, 0.027638307436870194, 0.01767201092198451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 139.57894736842107, 121, 362, 128.0, 137.0, 362.0, 362.0, 0.1076963190531793, 0.08003603398385689, 0.054058503899740394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 212.6315789473684, 117, 846, 125.0, 627.0, 846.0, 846.0, 0.10769876089741409, 3.359342229817819, 0.062446017767461365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 242.26315789473688, 121, 1119, 127.0, 876.0, 1119.0, 1119.0, 0.1076963190531793, 10.2265338045992, 0.062339429747990616], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d7d363af-98eb-4c32-848f-b73b38bf7b69", 3, 0, 0.0, 450.0, 217, 876, 257.0, 876.0, 876.0, 876.0, 0.034329656245708794, 0.022070661160571246, 0.022014786069025495], "isController": false}, {"data": ["goToProfile", 12, 2, 16.666666666666668, 233.41666666666666, 125, 412, 214.0, 385.30000000000007, 412.0, 412.0, 0.09239724656205245, 0.18196723362643794, 0.05971833758104009], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/2ead02df-a14d-4e61-8b07-ba6d47ad2fc1", 3, 0, 0.0, 305.3333333333333, 240, 412, 264.0, 412.0, 412.0, 412.0, 0.021470592445214202, 0.025377513401228118, 0.013768576535505204], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 124.26666666666667, 118, 129, 125.0, 127.8, 129.0, 129.0, 0.09944509636229837, 0.07390402180830964, 0.049916776884981806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 174.26666666666668, 120, 378, 126.0, 376.2, 378.0, 378.0, 0.0992779186053438, 0.02656459931432051, 0.056619437954610136], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 5, 0, 0.0, 833.8, 622, 956, 877.0, 956.0, 956.0, 956.0, 0.10128018149408524, 29.77973617778723, 0.057761353508345485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 5, 0, 0.0, 1047.8, 874, 1121, 1075.0, 1121.0, 1121.0, 1121.0, 0.10088781275221953, 90.77903125630549, 0.05743905745560936], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 5, 0, 0.0, 173.8, 120, 375, 125.0, 375.0, 375.0, 375.0, 0.10285949393128986, 0.18201308887060275, 0.05695442681547007], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 184.0, 121, 379, 127.0, 378.2, 379.0, 379.0, 0.08767729360427864, 0.06515861370396099, 0.04400989151621019], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 201.6923076923077, 125, 376, 127.0, 375.6, 376.0, 376.0, 0.08768439015506646, 0.03359302807923971, 0.049441033090739855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 241.15384615384613, 120, 1125, 126.0, 826.1999999999998, 1125.0, 1125.0, 0.08782418948406667, 6.100647418391061, 0.051050449085615075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 275.23076923076917, 121, 618, 128.0, 610.0, 618.0, 618.0, 0.08754444564163344, 3.980115626010128, 0.050394612902031025], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 5, 0, 0.0, 219.8, 126, 362, 126.0, 362.0, 362.0, 362.0, 0.1028446839582862, 0.07643047313696856, 0.05774970046485797], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 20, 0, 0.0, 588.15, 121, 1130, 501.0, 1121.0, 1129.55, 1130.0, 0.12130181103603876, 54.59013871241161, 0.06610001031065395], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 254.26666666666668, 117, 379, 358.0, 376.6, 379.0, 379.0, 0.09927529038022435, 0.026757793110294848, 0.05836301250868659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 20, 0, 0.0, 488.49999999999994, 123, 1111, 484.5, 996.2000000000003, 1105.8999999999999, 1111.0, 0.12130401819560273, 17.85005212282032, 0.0662196739954511], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 165.26666666666662, 119, 484, 126.0, 419.80000000000007, 484.0, 484.0, 0.09944641495674081, 0.026803916531309046, 0.05856073068253389], "isController": false}, {"data": ["deleteBooks", 12, 2, 16.666666666666668, 628.1666666666667, 128, 1998, 515.0, 1655.7000000000012, 1998.0, 1998.0, 0.09287206872533087, 0.018547205131181795, 0.06292747755591672], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/57b134b0-ce88-4723-94cc-be8d15abf68b", 3, 0, 0.0, 355.33333333333337, 213, 636, 217.0, 636.0, 636.0, 636.0, 0.033570189671571646, 0.027986085855760085, 0.02152775835058468], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 501.6153846153845, 249, 1252, 259.0, 1054.3999999999999, 1252.0, 1252.0, 0.08732451131860013, 10.134405752502182, 0.1940989306945657], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7fef4466-ff16-4bdd-9bbf-901782ea2e9e", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.7750872269417476, 1.4482516686893205], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc36d380-ee45-474b-b70e-41aa9e03711e", 3, 0, 0.0, 385.66666666666663, 203, 731, 223.0, 731.0, 731.0, 731.0, 0.018746485034056116, 0.025843543007561084, 0.012021671717802912], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 748.9499999999999, 235, 2934, 556.0, 1566.2000000000003, 2866.1499999999987, 2934.0, 0.10536630596267926, 0.06472207661184107, 0.04764121060617236], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 20, 0, 0.0, 126.74999999999999, 122, 130, 127.0, 128.0, 129.9, 130.0, 0.121300339640951, 0.09014605319019893, 0.060887084546336734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 20, 0, 0.0, 187.45000000000002, 122, 379, 127.0, 374.9, 378.8, 379.0, 0.12130254674696896, 0.12355327759481309, 0.06408659940440449], "isController": false}, {"data": ["login", 20, 0, 0.0, 2980.3500000000004, 1466, 5556, 2889.0, 5148.500000000004, 5543.2, 5556.0, 0.10232481990831696, 30.74433652107124, 0.19680540313420924], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 127.93333333333334, 123, 134, 128.0, 132.8, 134.0, 134.0, 0.09380569713267253, 0.07594230754197805, 0.03334499390262969], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/cf839e1b-121c-446f-9ff0-ec2daf13a3a2", 1, 0, 0.0, 286.0, 286, 286, 286.0, 286.0, 286.0, 286.0, 3.4965034965034967, 1.116559222027972, 2.0862926136363638], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e0753a8-9a9a-4959-8919-55f0751b52bb", 3, 0, 0.0, 352.3333333333333, 310, 424, 323.0, 424.0, 424.0, 424.0, 0.04502070952638214, 0.02894397829251456, 0.02887070239810313], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0a9e64d-cb78-48d2-b918-b24eae8cb147", 1, 0, 0.0, 597.0, 597, 597, 597.0, 597.0, 597.0, 597.0, 1.6750418760469012, 0.534901067839196, 0.9994634631490787], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 20, 0, 0.0, 730.25, 254, 1260, 756.0, 1249.6, 1259.5, 1260.0, 0.12120624454571899, 72.59632629554324, 0.25708980776689616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=20be611d-881d-4462-b151-64d8e00d5f9c", 1, 0, 0.0, 1998.0, 1998, 1998, 1998.0, 1998.0, 1998.0, 1998.0, 0.5005005005005005, 0.0904224537037037, 0.3450716341341341], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 422.10526315789474, 248, 1248, 256.0, 1002.0, 1248.0, 1248.0, 0.10761823845935994, 13.70173883991787, 0.23913750531011044], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, 44.44444444444444, 761.4444444444445, 125, 1483, 1004.0, 1483.0, 1483.0, 1483.0, 0.10213693157960439, 67.89619022152365, 0.15802631373628243], "isController": false}, {"data": ["register", 22, 5, 22.727272727272727, 3034.999999999999, 202, 19837, 929.0, 12294.099999999997, 18885.249999999985, 19837.0, 0.08953462344586208, 0.028313416966811143, 0.04039550393748855], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 438.0, 254, 606, 491.0, 543.6, 606.0, 606.0, 0.09919519630729348, 0.15373318021452614, 0.2230923213825165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 147.46153846153845, 121, 354, 128.0, 270.79999999999995, 354.0, 354.0, 0.08415002006654325, 0.06533131440713075, 0.029912702445529047], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 407.5, 253, 1246, 262.0, 794.2000000000007, 1246.0, 1246.0, 0.08795332610161541, 5.9744463139616135, 0.19655888719497297], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=80a22d86-9d98-4908-bb2e-de32c505e635", 1, 0, 0.0, 389.0, 389, 389, 389.0, 389.0, 389.0, 389.0, 2.5706940874035986, 0.46443203727506427, 1.7723730719794344], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 127.27272727272725, 124, 129, 127.0, 129.0, 129.0, 129.0, 0.056739344608988544, 0.0421666418432034, 0.028480491336933703], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 126.09090909090908, 116, 139, 126.0, 137.8, 139.0, 139.0, 0.05674051530704356, 0.02292993835916746, 0.03192661452557192], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 238.8181818181818, 122, 1093, 128.0, 950.2000000000005, 1093.0, 1093.0, 0.05674080798910577, 4.65531027066655, 0.032914101509305495], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 207.72727272727272, 118, 1012, 127.0, 837.0000000000006, 1012.0, 1012.0, 0.05674080798910577, 1.5306014299973176, 0.03296951245460735], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 128.5, 128, 129, 128.5, 129.0, 129.0, 129.0, 0.8952551477170994, 0.26403032676812893, 0.5534145590868398], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d7d363af-98eb-4c32-848f-b73b38bf7b69", 1, 0, 0.0, 663.0, 663, 663, 663.0, 663.0, 663.0, 663.0, 1.5082956259426847, 0.2724948152337858, 1.039899132730015], "isController": false}, {"data": ["https://demoqa.com/books", 58, 1, 1.7241379310344827, 1177.7586206896551, 927, 1830, 1007.5, 1603.2, 1745.25, 1830.0, 0.25185854234697425, 300.0417420591281, 0.4951383227198117], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, 22.727272727272727, 3034.999999999999, 202, 19837, 929.0, 12294.099999999997, 18885.249999999985, 19837.0, 0.08783592249677602, 0.027776238985574946, 0.039629097845225114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 160.85714285714286, 122, 374, 126.0, 374.0, 374.0, 374.0, 0.03703311818855148, 0.009981582636758014, 0.0218075881520474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73cf53e8-57b1-4fc1-af62-acb08fee04a3", 1, 0, 0.0, 472.0, 472, 472, 472.0, 472.0, 472.0, 472.0, 2.1186440677966103, 0.6765591896186441, 1.2641518802966103], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 161.14285714285714, 115, 378, 126.0, 378.0, 378.0, 378.0, 0.03703546939812071, 0.009982216361212224, 0.02177280525162956], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 163.6923076923077, 119, 375, 126.0, 367.8, 375.0, 375.0, 0.0840064620355412, 0.022642366720516963, 0.049386611470113084], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/53cc4305-2a52-4e43-8f26-b22050420cf2", 1, 0, 0.0, 216.0, 216, 216, 216.0, 216.0, 216.0, 216.0, 4.62962962962963, 1.4784071180555556, 2.7624059606481484], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 199.84615384615387, 120, 374, 127.0, 374.0, 374.0, 374.0, 0.08400591918630575, 0.02264222040568397, 0.049468329364592147], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=27ac826f-582c-4476-9529-a7a8863d4894", 1, 0, 0.0, 512.0, 512, 512, 512.0, 512.0, 512.0, 512.0, 1.953125, 0.3528594970703125, 1.346588134765625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 124.28571428571428, 121, 128, 126.0, 128.0, 128.0, 128.0, 0.03703429375601807, 0.009909566883934523, 0.021121120657729055], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 170.53846153846152, 121, 457, 127.0, 425.0, 457.0, 457.0, 0.0838671801918623, 0.062327074341803915, 0.042097393182243384], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 126.14285714285714, 116, 129, 127.0, 129.0, 129.0, 129.0, 0.037032530432804474, 0.027521245761097858, 0.01858859437740381], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 166.15384615384613, 121, 375, 127.0, 374.2, 375.0, 375.0, 0.08400429068069322, 0.02247771059229487, 0.04790869702883286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 129.71428571428572, 123, 138, 129.0, 138.0, 138.0, 138.0, 0.03758813074225818, 0.029585970095957127, 0.01336140584978709], "isController": false}, {"data": ["deleteAccount", 12, 2, 16.666666666666668, 497.99999999999994, 128, 876, 425.0, 853.8000000000001, 876.0, 876.0, 0.09576785871048578, 0.018689072687804762, 0.06517015255021827], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1631.9500000000003, 846, 3767, 1274.0, 3020.6000000000004, 3730.0999999999995, 3767.0, 0.105159658651748, 0.05442833895061176, 0.048369335180638004], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 290.14285714285717, 244, 508, 255.0, 508.0, 508.0, 508.0, 0.03700747022220342, 0.057354350822887534, 0.08323066789231882], "isController": false}, {"data": ["addBook", 58, 10, 17.24137931034483, 1097.2931034482756, 635, 1892, 979.0, 1791.2, 1850.6499999999999, 1892.0, 0.295750875779533, 92.67158391006879, 1.074626582649622], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=57b134b0-ce88-4723-94cc-be8d15abf68b", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["https://demoqa.com/books-0", 58, 0, 0.0, 226.53448275862073, 119, 793, 128.0, 508.0, 516.1, 793.0, 0.25309827194972945, 0.18809353999389072, 0.12234730919444929], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 1, 1.7241379310344827, 725.448275862069, 1, 1017, 627.0, 1003.0, 1007.05, 1017.0, 0.2530750803949717, 73.13771392071114, 0.1250845060781653], "isController": false}, {"data": ["https://demoqa.com/books-1", 58, 0, 0.0, 187.62068965517244, 117, 513, 127.5, 375.1, 380.29999999999995, 513.0, 0.2538737634596866, 0.44923755799702353, 0.12346595137004289], "isController": false}, {"data": ["https://demoqa.com/books-2", 58, 0, 0.0, 940.9827586206898, 804, 1259, 873.0, 1126.1, 1236.8999999999999, 1259.0, 0.2527651637308138, 227.43853863875066, 0.12687626382581865], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 147.22222222222223, 127, 377, 128.5, 182.6000000000003, 377.0, 377.0, 0.08495374740419105, 0.06346642262129508, 0.030198402397583538], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 10, 5.747126436781609, 235.84482758620703, 121, 4975, 130.0, 308.5, 375.75, 3721.0, 0.7201331004627062, 1.5977548996987028, 0.3440129365289584], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 177.63636363636365, 125, 393, 130.0, 390.6, 393.0, 393.0, 0.05425427499025889, 0.04201527350319854, 0.01928569931294359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2ead02df-a14d-4e61-8b07-ba6d47ad2fc1", 1, 0, 0.0, 824.0, 824, 824, 824.0, 824.0, 824.0, 824.0, 1.2135922330097086, 0.21925250303398058, 0.8367149575242719], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 130.4736842105263, 123, 160, 128.0, 136.0, 160.0, 160.0, 0.11128552351053113, 0.09031081058325328, 0.03955852593538411], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 368.0, 254, 1218, 256.0, 1076.0000000000005, 1218.0, 1218.0, 0.0567024923322766, 6.246788335395242, 0.12620633747003787], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/20be611d-881d-4462-b151-64d8e00d5f9c", 3, 0, 0.0, 455.6666666666667, 408, 547, 412.0, 547.0, 547.0, 547.0, 0.023109276063411854, 0.027314381961669413, 0.014819425079727002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 395.3846153846154, 247, 833, 261.0, 800.6, 833.0, 833.0, 0.08379960291880463, 0.1298730174142021, 0.188467271017585], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc36d380-ee45-474b-b70e-41aa9e03711e", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/27ac826f-582c-4476-9529-a7a8863d4894", 3, 0, 0.0, 403.33333333333337, 203, 802, 205.0, 802.0, 802.0, 802.0, 0.03956374378519525, 0.03298266531050945, 0.025371281008084192], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 131.46153846153845, 126, 148, 129.0, 144.8, 148.0, 148.0, 0.08616175876033112, 0.0714368488159386, 0.030627812684336456], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0e0753a8-9a9a-4959-8919-55f0751b52bb", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.4059866573033708, 1.5493328651685394], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e080ecb0-a605-48d4-ae95-ce09904deaff", 1, 0, 0.0, 590.0, 590, 590, 590.0, 590.0, 590.0, 590.0, 1.694915254237288, 0.3062102754237288, 1.168564618644068], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 20, 0, 0.0, 145.35000000000002, 126, 379, 130.5, 167.10000000000005, 368.54999999999984, 379.0, 0.12713265020722622, 0.0987016180808055, 0.04519168425334995], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4096220c-1739-43a5-bd7c-df8a0922d37e", 1, 0, 0.0, 857.0, 857, 857, 857.0, 857.0, 857.0, 857.0, 1.1668611435239205, 0.21080987456242709, 0.8044960618436406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 140.44444444444446, 120, 365, 127.0, 169.7000000000003, 365.0, 365.0, 0.08800794027194453, 0.06540433842475565, 0.04417586064431591], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 166.33333333333334, 119, 378, 126.0, 375.3, 378.0, 378.0, 0.08801052214687001, 0.030893450428073402, 0.049782861539890776], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 237.0, 122, 1123, 127.0, 452.500000000001, 1123.0, 1123.0, 0.08800880088008801, 4.421874045043393, 0.051319368047915905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 235.55555555555557, 116, 871, 129.5, 426.4000000000007, 871.0, 871.0, 0.08800923119047153, 1.4600498443947898, 0.05140556548375741], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 5, 20.0, 0.3816793893129771], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 8.0, 0.15267175572519084], "isController": false}, {"data": ["Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, 4.0, 0.07633587786259542], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 8.0, 0.15267175572519084], "isController": false}, {"data": ["401/Unauthorized", 14, 56.0, 1.0687022900763359], "isController": false}, {"data": ["Assertion failed", 1, 4.0, 0.07633587786259542], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1310, 25, "401/Unauthorized", 14, "406/Not Acceptable", 5, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 9, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 58, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 5, "406/Not Acceptable", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books-3", 58, 1, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
